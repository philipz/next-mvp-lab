Feature: Customer list page
  Scenario: Filter by keyword
    Given I open "/customers"
    When I type "Alice" into "Search"
    Then I should see a row containing "Alice"
