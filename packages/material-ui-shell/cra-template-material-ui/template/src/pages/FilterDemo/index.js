import AutoSizer from 'react-virtualized-auto-sizer'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import FilterDrawer from 'material-ui-shell/lib/components/FilterDrawer'
import FilterList from '@material-ui/icons/FilterList'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Page from 'material-ui-shell/lib/containers/Page'
import React, { useEffect, createRef, forwardRef, useCallback } from 'react'
import ReactList from 'react-list'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar'
import SearchField from 'material-ui-shell/lib/components/SearchField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import source from './data.json'
import { FixedSizeList } from 'react-window'
import { Scrollbars } from 'react-custom-scrollbars'
import { useFilter } from 'material-ui-shell/lib/providers/Filter'
import { useIntl } from 'react-intl'

const filterName = 'test_filter'

export default function () {
  const intl = useIntl()
  const { openFilter, getList, getFilter, setSearch } = useFilter()

  const { queries = [], search = {} } = getFilter(filterName)
  const { value: searchvalue = '' } = search

  const fields = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'email',
      label: 'E-Mail',
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
    },
    {
      name: 'isActive',
      label: 'Aktive',
      type: 'bool',
    },
  ]

  const list = getList(filterName, source, fields)

  const listRef = React.createRef()

  useEffect(() => {
    if (listRef.current) {
      console.log('listRef', listRef)
      listRef.current.scrollToItem(1500, 'center')
    }
  }, [listRef.current])

  const Row = ({ index, style }) => {
    const { name, amount = '', registered, email } = list[index]

    return (
      <div key={`${name}_${index}`} style={style}>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={`${name} ${index}`}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {email}
                </Typography>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {`${amount} ${registered}`}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider />
      </div>
    )
  }

  const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => {
    const { style, ...rest } = props
    return (
      <Scrollbar
        {...rest}
        forwardedRef={ref}
        style={{ ...style, overflow: 'hidden' }}
      />
    )
  })

  return (
    <Page
      pageTitle={intl.formatMessage(
        {
          id: 'filter_demo',
          defaultMessage: 'Filter demo with {count} rows',
        },
        { count: list.length }
      )}
      contentStyle={{ overflow: 'hidden' }}
      appBarContent={
        <Toolbar disableGutters>
          <SearchField
            initialValue={searchvalue}
            onChange={(v) => {
              setSearch(filterName, v)
            }}
          />
          <IconButton color="inherit" onClick={() => openFilter(filterName)}>
            <FilterList color={queries.length > 0 ? 'secondary' : undefined} />
          </IconButton>
        </Toolbar>
      }
    >
      <AutoSizer style={{ height: '100%', width: '100%' }}>
        {({ height, width }) => {
          return (
            <List>
              <FixedSizeList
                ref={(r) => {
                  if (r) {
                    listRef.current = r
                    //r.scrollToItem(1500)
                  }
                }}
                height={height}
                itemCount={list.length}
                itemSize={91}
                width={width}
                outerElementType={CustomScrollbarsVirtualList}
              >
                {Row}
              </FixedSizeList>
            </List>
          )
        }}
      </AutoSizer>
      <FilterDrawer fields={fields} name={filterName} />
    </Page>
  )
}