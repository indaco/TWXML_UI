var express 	= require('express'),
  	router 		= express.Router(),
    ctrlTWXMLActions = require('../controllers/twxml');

/* GET createdataset page. */
router.get('/', function(req, res) {
  res.render('actions', { title: 'TWXMLUI :: Getting Started' });
});

/* Actions routes */
router.get('/version', ctrlTWXMLActions.retrieveVersion);
router.get('/dsList', ctrlTWXMLActions.datasetList);
router.post('/create', ctrlTWXMLActions.datasetCreation);
router.post('/configure', ctrlTWXMLActions.datasetConfiguration);
router.get('/use', ctrlTWXMLActions.useDataset);
router.post('/optimize', ctrlTWXMLActions.optimizeDataset);
router.delete('/delete', ctrlTWXMLActions.datasetDeletion);
router.post('/createFilter', ctrlTWXMLActions.submitFilter);
router.get('/filterList', ctrlTWXMLActions.filterListByDataset);
router.post('/submitSignals', ctrlTWXMLActions.submitSignals);
router.post('/submitProfiles', ctrlTWXMLActions.submitProfiles);
router.post('/submitClusters', ctrlTWXMLActions.submitClusters);
router.post('/submitPredictions', ctrlTWXMLActions.submitPredictions);
router.get('/jobStatus', ctrlTWXMLActions.jobStatus);
router.get('/jobResults', ctrlTWXMLActions.jobResults);

module.exports = router;
