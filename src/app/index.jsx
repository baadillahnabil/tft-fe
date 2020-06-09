import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Snackbar,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core'
import {
  Add as AddIcon,
  Create as CreateIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
import axios from 'axios'
import clsx from 'clsx'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { cloneDeep, findIndex } from 'lodash'

import useStyles from './style'

const App = () => {
  const classes = useStyles()

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState({})

  const [showInputModal, setShowInputModal] = useState(false)
  const [useModalFor, setUseModalFor] = useState('create')

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)

      const response = await axios.get('http://localhost:5000/customers')
      setCustomers(
        response.data.data.map(data => ({
          ...data,
          showDetail: false
        }))
      )
    } catch (error) {
      setSnackbarMessage('Error fetching data')
      setOpenSnackbar(true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchCustomers()
  }, [])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: useModalFor === 'edit' ? selectedCustomer.name : '',
      email: useModalFor === 'edit' ? selectedCustomer.email : '',
      password: '',
      gender: useModalFor === 'edit' ? selectedCustomer.gender : '',
      status: useModalFor === 'edit' ? selectedCustomer.is_married : '',
      address: useModalFor === 'edit' ? selectedCustomer.address : ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('This field is required!'),
      email: Yup.string().required('This field is required!'),
      password: Yup.string().required('This field is required!'),
      gender: Yup.string().required('This field is required!'),
      status: Yup.string().required('This field is required!'),
      address: Yup.string().required('This field is required!')
    }),
    validateOnChange: true,
    onSubmit: async values => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          password: values.password,
          gender: values.gender,
          is_married: values.status,
          address: values.address
        }

        let response
        if (useModalFor === 'create') {
          response = await axios.post(
            'http://localhost:5000/customers',
            payload
          )
        } else {
          response = await axios.put(
            `http://localhost:5000/customers/${selectedCustomer.id}`,
            payload
          )
        }

        setShowInputModal(false)
        setSnackbarMessage(response.data.status.message)
        setOpenSnackbar(true)
        fetchCustomers()
      } catch (error) {
        setSnackbarMessage('Something error occurred')
        setOpenSnackbar(true)
      }
    }
  })

  const onDeleteCustomer = async id => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/customers/${id}`
      )
      setSnackbarMessage(response.data.status.message)
      setOpenSnackbar(true)
      fetchCustomers()
    } catch (error) {
      setSnackbarMessage('Something error occurred')
      setOpenSnackbar(true)
    }
  }

  if (isLoading) return <CircularProgress color="secondary" />
  return (
    <div className={classes.root}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        Customers List
      </Typography>

      <div className={classes.cards}>
        {customers.map(customer => (
          <Card
            className={clsx([
              classes.card,
              customer.showDetail && classes.cardOnDetail
            ])}
            key={customer.id}
            elevation={3}
          >
            <CardContent className={classes.cardContent}>
              <Typography
                className={classes.customerName}
                variant="h5"
                component="h2"
              >
                {customer.name}
              </Typography>
              <Typography
                className={classes.customerEmail}
                color="textSecondary"
              >
                {customer.email}
              </Typography>

              {customer.showDetail && (
                <div className={classes.detailSection}>
                  <Typography>
                    Gender: <b>{customer.gender === 'M' ? 'Male' : 'Female'}</b>
                  </Typography>
                  <Typography>
                    Status:{' '}
                    <b>
                      {customer.is_married === 'M' ? 'Married' : 'Not Married'}
                    </b>
                  </Typography>
                  <Typography>
                    Address: <b>{customer.address}</b>
                  </Typography>
                </div>
              )}
            </CardContent>
            <CardActions className={classes.cardActions}>
              <IconButton
                color="secondary"
                onClick={() => {
                  setSelectedCustomer(customer)
                  setUseModalFor('edit')
                  setShowInputModal(true)
                }}
              >
                <CreateIcon />
              </IconButton>
              <IconButton color="default">
                <VisibilityIcon
                  onClick={() => {
                    const newCustomers = cloneDeep(customers)
                    const customerIndex = findIndex(newCustomers, {
                      id: customer.id
                    })
                    newCustomers[customerIndex].showDetail = !newCustomers[
                      customerIndex
                    ].showDetail
                    setCustomers(newCustomers)
                  }}
                />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => onDeleteCustomer(customer.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
        <Card className={clsx(classes.card, classes.cardAdd)}>
          <CardContent
            className={clsx(classes.cardContent, classes.cardContentAdd)}
          >
            <Button
              className={classes.addButton}
              onClick={() => {
                setUseModalFor('create')
                setShowInputModal(true)
              }}
            >
              <AddIcon />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showInputModal} onClose={() => setShowInputModal(false)}>
        <DialogTitle>
          {useModalFor === 'create' ? 'Create new customer' : 'Edit a customer'}
        </DialogTitle>
        <DialogContent classes={{ root: classes.inputModalContent }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            helperText={
              formik.errors.name && formik.touched.name && formik.errors.name
            }
            onBlur={formik.handleBlur}
            error={formik.errors.name && formik.touched.name}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            helperText={
              formik.errors.email && formik.touched.email && formik.errors.email
            }
            onBlur={formik.handleBlur}
            error={formik.errors.email && formik.touched.email}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            helperText={
              formik.errors.password &&
              formik.touched.password &&
              formik.errors.password
            }
            onBlur={formik.handleBlur}
            error={formik.errors.password && formik.touched.password}
          />
          <FormControl
            className={classes.formControl}
            error={formik.errors.gender && formik.touched.gender}
          >
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </Select>
            <FormHelperText>
              {formik.errors.gender &&
                formik.touched.gender &&
                formik.errors.gender}
            </FormHelperText>
          </FormControl>
          <FormControl
            className={classes.formControl}
            error={formik.errors.status && formik.touched.status}
          >
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
            >
              <MenuItem value="M">Married</MenuItem>
              <MenuItem value="N">Not Married</MenuItem>
            </Select>
            <FormHelperText>
              {formik.errors.status &&
                formik.touched.status &&
                formik.errors.status}
            </FormHelperText>
          </FormControl>
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            helperText={
              formik.errors.address &&
              formik.touched.address &&
              formik.errors.address
            }
            onBlur={formik.handleBlur}
            error={formik.errors.address && formik.touched.address}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInputModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => {
          setOpenSnackbar(false)
          setSnackbarMessage('')
        }}
        message={snackbarMessage}
      />
    </div>
  )
}

export default App
