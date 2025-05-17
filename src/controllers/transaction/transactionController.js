const {
    addTransactionIncomeService, 
    addTransactionExpenseService,
    getTransactionIncomeService,
    getTransactionExpenseService,
    getTransactionAllService,
    deleteTransactionService,
    getTransactionIncomeCategoriesService,
    getTransactionExpenseCategoriesService,
    getTransactionPeriodDataService
  } = require('./transactionService');
  
  
  const addIncomeController = async (req, res) => {
    const {status, message} = await addTransactionIncomeService(req.body, req.user, req.user._id);
    res.status(status).json(message)
  };
  
  
  const addExpenseController = async (req, res) => {
    const { status, message } = await addTransactionExpenseService(req.body, req.user, req.user._id);
    res.status(status).json(message);
  };
  
  
  const getIncomeController = async (req, res) => {
    const { status, message } = await getTransactionIncomeService(req.user._id);
    res.status(status).json(message);
  };
  
  
  const getExpenseController = async (req, res) => {
    const { status, message } = await getTransactionExpenseService(req.user._id);
    res.status(status).json(message);
  };
  
  const getAllController = async (req, res) => {
    const { status, message } = await getTransactionAllService(req.user._id);
    res.status(status).json(message);
  };
  
  const deleteTransactionController = async (req, res) => {
    const {status, message } = await deleteTransactionService(req.params.id, req.user._id, req.user)
    res.status(status).json(message);
  }
  
  
  const getTransactionIncomeCategoriesController = async (req, res) => {
    const {status, message} = await getTransactionIncomeCategoriesService();
    res.status(status).json(message)
  }
  
  
  const getTransactionExpenseCategoriesController = async (req, res) => {
    const {status, message} = await getTransactionExpenseCategoriesService();
    res.status(status).json(message)
  }
  
  const getTransactionPeriodDataController = async (req, res) => {
    const {status, message } = await getTransactionPeriodDataService(req.query.date, req.user._id)
    res.status(status).json(message);
  }
  
  module.exports = {
    addIncomeController,
    addExpenseController,
    getIncomeController,
    getExpenseController,
    getAllController,
    deleteTransactionController,
    getTransactionIncomeCategoriesController,
    getTransactionExpenseCategoriesController,
    getTransactionPeriodDataController
  }