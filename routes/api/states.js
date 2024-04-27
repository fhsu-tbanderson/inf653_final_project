const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStateAbbreviation = require('../../middleware/verifyAbbreviations');

router.route('/')
    .get(verifyStateAbbreviation, statesController.getAllStates)



router.route('/:state')
    .get(verifyStateAbbreviation, statesController.getState)


router.route('/:state/funfact')
    .get(verifyStateAbbreviation, statesController.getStateFunFact)
    .post(verifyStateAbbreviation, statesController.createNewFunFacts)
    .patch(verifyStateAbbreviation, statesController.updateFunFacts)
    .delete(verifyStateAbbreviation, statesController.deleteFunFacts)

router.route('/:state/capital')
    .get(verifyStateAbbreviation, statesController.getStateCapital)

router.route('/:state/nickname')
    .get(verifyStateAbbreviation, statesController.getStateNickName)

router.route('/:state/population')
    .get(verifyStateAbbreviation, statesController.getStatePopulation)

router.route('/:state/admission')
    .get(verifyStateAbbreviation, statesController.getStateAdmissionDate)

module.exports = router;