const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const CanFulfillIntentRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'CanFulfillIntentRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';

    return handlerInput.responseBuilder
      .withCanFulfillIntent(
      {
        "canFulfill": "YES",
        "slots":{
            "who": {
                "canUnderstand": "YES",
                "canFulfill": "YES"
              },
            "when": {
              "canUnderstand": "YES",
              "canFulfill": "YES"
            }
          }
      })
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const ScheduleIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ScheduleIntent';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent
    if (handlerInput.requestEnvelope.request.dialogState === "STARTED") {
    // Pre-fill slots: update the intent object with slot values for which
    // you have defaults, then return Dialog.Delegate with this updated intent
    // in the updatedIntent property.
    /*return handlerInput.responseBuilder
      .addDelegateDirective({
        "type": "Dialog.Delegate",
        "updatedIntent": {
          "name": "ScheduleIntent",
          "confirmationStatus": "NONE",
          "slots": {
            "who": {
              "name": "who",
              "value": "",
              "confirmationStatus": "NONE"
            }
          }
        }
      })
      .getResponse();
    ;*/
      
      return handlerInput.responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    } else if (handlerInput.requestEnvelope.request.dialogState != "COMPLETED"){
        // return a Dialog.Delegate directive with no updatedIntent property.
        return handlerInput.responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    } else {
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler. 
      const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
      const slotValues = getSlotValues(filledSlots);
      return handlerInput.responseBuilder
        .withCanFulfillIntent(
        {
          "canFulfill": "YES",
          "slots":{
              "who": {
                  "canUnderstand": "YES",
                  "canFulfill": "YES"
                },
              "when": {
                "canUnderstand": "YES",
                "canFulfill": "YES"
              }
            }
        })
        .speak('Sure. Let me create one!')
        .withSimpleCard('Sure', 'Sure. Let me create one!')
        .getResponse();
    }
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

let skill;

exports.handler = async function (event, context) {
  console.log('REQUEST++++' ,JSON.stringify(event));
  Alexa.appId = 'amzn1.ask.skill.902806d2-ccaa-444c-929c-6c2e7a4d35d4';
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        CanFulfillIntentRequestHandler,
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        ScheduleIntentHandler
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log('RESPONSE++++', JSON.stringify(response));

  return response;
};


function getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;

    if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            value: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
            id: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
            isValidated: true
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            value: filledSlots[item].value,
            id: null,
            isValidated: false,
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        synonym: filledSlots[item].value,
        value: filledSlots[item].value,
        id: filledSlots[item].id,
        isValidated: false
      };
    }
  }, this);

  return slotValues;
}