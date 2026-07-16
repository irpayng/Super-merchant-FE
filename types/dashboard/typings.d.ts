interface UserAnalyticsData {
  summary: UserAnalyticsSummary
  onboarding_chart: OnboardingChart
  tier_distribution: TierDistribution
}
interface TableRowActionProps {
  label: string
  icon?: any
  danger?: boolean
  hidden?: (row?: any) => boolean
  onClick: (row?: any) => void
}
