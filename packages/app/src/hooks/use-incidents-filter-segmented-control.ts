import { t } from '@metis/shared'
import { useCallback, useState } from 'react'
import { SCREEN_WIDTH } from '~/config'

const filterTypes = {
  LATEST_DAY: { label: () => t('24h') },
  LATEST_7_DAYS: { label: () => t('7d') },
  LATEST_30_DAYS: { label: () => t('30d') },
}

const filterOptionsArr = Object.entries(filterTypes).map(([name, { label }], index) => ({
  index,
  name,
  label,
}))

type FilterType = keyof typeof filterTypes
type FilterOption = typeof filterOptionsArr[number]

export const useIncidentsFilterSegmentedControlProps = () => {
  const [filterType, setFilterType] = useState<FilterType>('LATEST_DAY')

  const onSegmentedControlItemPress = ({ name }: FilterOption) => {
    setFilterType(name as FilterType)
  }

  const getSelectedIndex = useCallback(() => {
    const index = filterOptionsArr.findIndex((item) => item.name === filterType)
    return index !== -1 ? index : 0
  }, [filterType])

  const labelExtractor = (item: FilterOption) => item.label()

  return {
    values: filterOptionsArr,
    labelExtractor,
    width: SCREEN_WIDTH,
    onItemPress: onSegmentedControlItemPress,
    selectedIndex: getSelectedIndex(),
  }
}
