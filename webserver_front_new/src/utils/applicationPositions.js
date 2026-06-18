export const parsePositionDetails = (positionDetails) => {
  if (!positionDetails) return []

  try {
    const parsed = JSON.parse(positionDetails)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const summarizePositions = (positions) => {
  return positions.reduce((summary, position) => ({
    memberCount: summary.memberCount + (Number(position.memberCount) || 0),
    monthlySalary: summary.monthlySalary + (Number(position.monthlySalary) || 0),
  }), { memberCount: 0, monthlySalary: 0 })
}
