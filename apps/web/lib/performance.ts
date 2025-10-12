// Performance monitoring utilities for Core Web Vitals and other metrics

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
} as const

// Get rating based on thresholds
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Report metric to analytics service
function reportMetric(metric: PerformanceMetric) {
  // In production, send to analytics service (Google Analytics, etc.)
  console.log('[Performance]', metric)
  
  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'web_vital', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    })
  }
}

// Observe Core Web Vitals using built-in Performance API
export function observeWebVitals() {
  if (typeof window === 'undefined') return

  // Use Performance Observer API for Core Web Vitals
  try {
    // Observe Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      reportMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        rating: getRating('LCP', lastEntry.startTime),
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Observe First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          reportMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: getRating('FCP', entry.startTime),
          })
        }
      })
    }).observe({ entryTypes: ['paint'] })

    // Observe Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      reportMetric({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
      })
    }).observe({ entryTypes: ['layout-shift'] })

    // Observe First Input Delay (FID) using event timing
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const eventEntry = entry as any // PerformanceEventTiming
        if (eventEntry.processingStart && eventEntry.startTime) {
          const delay = eventEntry.processingStart - eventEntry.startTime
          reportMetric({
            name: 'FID',
            value: delay,
            rating: getRating('FID', delay),
          })
        }
      }
    }).observe({ entryTypes: ['first-input'] })

  } catch (error) {
    console.warn('Failed to observe web vitals:', error)
  }
}

// Custom performance marks and measures
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(name)
  }
}

export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      const measure = endMark 
        ? performance.measure(name, startMark, endMark)
        : performance.measure(name, startMark)
      
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`)
      return measure.duration
    } catch (error) {
      console.warn(`Failed to measure performance for ${name}:`, error)
    }
  }
  return 0
}

// Monitor page load performance
export function monitorPageLoad() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const metrics = {
          DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
          TCP: navigation.connectEnd - navigation.connectStart,
          TLS: navigation.secureConnectionStart > 0 
            ? navigation.connectEnd - navigation.secureConnectionStart 
            : 0,
          TTFB: navigation.responseStart - navigation.requestStart,
          Download: navigation.responseEnd - navigation.responseStart,
          DOMParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
          DOMReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          Load: navigation.loadEventEnd - navigation.loadEventStart,
          Total: navigation.loadEventEnd - navigation.fetchStart,
        }

        console.log('[Performance] Page Load Metrics:', metrics)
        
        // Report slow pages
        if (metrics.Total > 3000) {
          reportMetric({
            name: 'Slow Page Load',
            value: metrics.Total,
            rating: 'poor',
          })
        }
      }
    }, 0)
  })
}

// Resource loading performance
export function monitorResourceLoading() {
  if (typeof window === 'undefined') return
  
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming
        
        // Monitor slow resources
        if (resource.duration > 1000) {
          console.warn(`[Performance] Slow resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`)
        }
        
        // Monitor large resources
        if (resource.transferSize > 500000) { // 500KB
          console.warn(`[Performance] Large resource: ${resource.name} is ${(resource.transferSize / 1024).toFixed(2)}KB`)
        }
      }
    }
  }).observe({ entryTypes: ['resource'] })
}