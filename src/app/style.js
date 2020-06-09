import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    padding: '5% 10%'
  },

  title: {
    fontSize: 32,
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: 40
  },

  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  card: {
    minWidth: 300,
    marginLeft: 10,
    marginBottom: 10
  },
  cardOnDetail: {
    width: '100%',
    boxShadow: 'none',
    border: `3px solid ${theme.palette.primary.main}`
  },
  cardAdd: {
    boxShadow: 'none',
    border: `2px dashed ${theme.palette.primary.main}`
  },
  cardContent: {
    textAlign: 'center'
  },
  cardContentAdd: {
    height: '100%',
    padding: '0 !important'
  },
  cardActions: {
    justifyContent: 'center'
  },
  addButton: {
    width: '100%',
    height: '100%'
  },

  customerName: {
    marginTop: 30
  },
  customerEmail: {
    fontStyle: 'italic',
    fontSize: 14
  },

  detailSection: {
    marginTop: 30
  },

  inputModalContent: {
    minWidth: 600
  },

  formControl: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5
  }
}))
