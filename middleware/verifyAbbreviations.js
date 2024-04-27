const stateData = require('../models/statesData.json');


const verifyStateAbbreviation = (req, res, next) => {
    const state = req?.params?.state
    const stateAbbreviations = stateData.map(element => element.code.toUpperCase());

    const normalizedState = state.toUpperCase();


    if (stateAbbreviations.includes(normalizedState)) {
        req.state = normalizedState;
        next();
    } else {
        res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }
};

module.exports = verifyStateAbbreviation;