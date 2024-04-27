const State = require('../models/State');
const stateData = {
    states: require('../models/statesData.json')
};

const getAllStates = async (req, res) => {

    const modifiedStates = [];
    for (const element of stateData.states) {
        let queryResult = await State.findOne({ stateCode: element.code }, 'funfacts').exec();
        let funFacts = queryResult?.funfacts ? queryResult.funfacts : [];
        modifiedStates.push({ ...element, "funfacts": funFacts });
    }

    let returnedValues = modifiedStates;

    if (req?.query?.contig === 'true') {
        returnedValues = modifiedStates.filter((element) => element.code !== 'AK' && element.code != 'HI');
    }
    if (req?.query?.contig === 'false') {
        returnedValues = modifiedStates.filter((element) => element.code === 'AK' || element.code === 'HI');
    }

    res.status(200).json(returnedValues);

};

const getState = async (req, res) => {
    const stateQuery = stateData.states.find((element) => element.code === req.state)
    const queryResult = await State.findOne({ stateCode: req.state }, 'funfacts').exec();
    const funFacts = queryResult?.funfacts ? queryResult.funfacts : [];


    const modifiedState = { ...stateQuery, "funfacts": funFacts };

    res.status(200).json(modifiedState);


}


const getStateFunFact = async (req, res) => {
    const stateQuery = stateData.states.find((element) => element.code === req.state)
    const queryResult = await State.findOne({ stateCode: req.state }, 'funfacts').exec();
    const funFacts = queryResult?.funfacts ? queryResult.funfacts : [];


    if (funFacts.length) {
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        res.status(200).json({ "funfact": funFacts[randomIndex] });
    }
    else {
        res.status(404).json({ "message": `No Fun Facts found for ${stateQuery.state}` });
    }


}

const getStateCapital = async (req, res) => {
    const stateQuery = stateData.states.find((element) => element.code === req.state)
    if (stateQuery) {
        res.status(200).json({ "state": stateQuery.state, "capital": stateQuery.capital_city });
    }
    else {
        res.status(404).json({ "message": "No state data found" });
    }
}

const getStateNickName = async (req, res) => {
    const stateQuery = stateData.states.find((element) => element.code === req.state)
    if (stateQuery) {
        res.status(200).json({ "state": stateQuery.state, "nickname": stateQuery.nickname });
    }
    else {
        res.status(404).json({ "message": "No state data found" });
    }
}


const getStatePopulation = async (req, res) => {
    const stateQuery = stateData.states.find((element) => element.code === req.state)
    if (stateQuery) {
        const formattedNumber = stateQuery.population.toLocaleString('en-US');
        res.status(200).json({ "state": stateQuery.state, "population": formattedNumber });
    }
    else {
        res.status(404).json({ "message": "No state data found" });
    }
}

const getStateAdmissionDate = async (req, res) => {
    const stateQuery = stateData.states.find((element) => element.code === req.state)
    if (stateQuery) {
        res.status(200).json({ "state": stateQuery.state, "admitted": stateQuery.admission_date });
    }
    else {
        res.status(404).json({ "message": "No state data found" });
    }
}

const createNewFunFacts = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    if (!Array.isArray(req?.body?.funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }



    try {

        const currentState = await State.findOne({ stateCode: req.state }).exec();

        if (!currentState) {
            const newState = new State({
                stateCode: req.state,
                funfacts: req.body.funfacts
            });

            const result = await newState.save();
            res.status(200).json(result);
        }
        else {
            currentState.funfacts = [...currentState.funfacts, ...req.body.funfacts];
            const result = await currentState.save();
            res.status(200).json(result);
        }

    }
    catch (error) {
        res.status(500).json({ 'message': 'An error occurred when creating new fun facts', "error": error });
    }

}

const updateFunFacts = async (req, res) => {
    if (req?.body?.index === undefined) {
        return res.status(400).json({ "message": "State fun fact index value required" });
    }

    if (!req?.body?.funfact) {
        return res.status(400).json({ "message": "State fun fact value required" });
    }

    if (typeof (req?.body?.funfact) !== 'string') {
        return res.status(400).json({ "message": "State fun fact value required" });
    }

    const stateQuery = stateData.states.find((element) => element.code === req.state)
    const funFactIndex = req?.body?.index;
    const funFact = req?.body?.funfact;

    const currentState = await State.findOne({ stateCode: req.state }).exec();

    if (currentState.funfacts[funFactIndex - 1] === undefined) {
        res.status(404).json({ "message": `No Fun Fact found at that index for ${stateQuery.state}` });
    }
    else {
        console.log(funFact);
        currentState.funfacts[funFactIndex - 1] = funFact;
        const result = await currentState.save();
        res.status(200).json(result);
    }


}

const deleteFunFacts = async (req, res) => {
    if (req?.body?.index === undefined) {
        return res.status(400).json({ "message": "State fun fact index value required" });
    }

    const stateQuery = stateData.states.find((element) => element.code === req.state)
    const funFactIndex = req?.body?.index;
    const currentState = await State.findOne({ stateCode: req.state }).exec();

    if (currentState.funfacts[funFactIndex - 1] === undefined) {
        res.status(404).json({ "message": `No Fun Fact found at that index for ${stateQuery.state}` });
    }
    else {
        currentState.funfacts.splice(funFactIndex - 1, funFactIndex - 1);
        const result = await currentState.save();
        res.status(200).json(result);
    }


}



module.exports = { getAllStates, createNewFunFacts, getStateFunFact, getStateCapital, getStateNickName, getStatePopulation, getStateAdmissionDate, getState, updateFunFacts, deleteFunFacts };
