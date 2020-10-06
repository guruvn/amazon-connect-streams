require("../unit/test-setup.js");

describe('Connections API', function () {

  describe('#Chat Connection API', function () {

    const connectionId = "connectionId";
    const contactId = "contactId";
    const initMediaController = sinon.spy();

    var chatMonitorInfo = {
      agent: {
        agentName: "Agent",
      },
      customer: {
        CustomerName: "CustomerName",
      },
      joinTime: 123
    };

    var chatMediaInfo = {
      customerName: "CustomerName"
    };

    before(function () {

      connect.core.getAgentDataProvider = sinon.stub().returns({
        getContactData: () => { return {} },
        _initMediaController: initMediaController,
        getConnectionData: () => {
          return {
            state: {},
            chatMediaInfo: chatMediaInfo,
            monitoringInfo: chatMonitorInfo,
            getMediaController: () => { }
          }
        },
      })
    });

    after(function () {
      initMediaController.resetHistory();
      connect.core.getAgentDataProvider.resetBehavior();
    });

    it('Should create new Chat connection Object given the chat Contact and Connection Id ', function () {
      const chatConnection = new connect.ChatConnection(contactId, connectionId);
      assert.equal(chatConnection.connectionId, connectionId);
      assert.equal(chatConnection.contactId, contactId);
      assert.equal(chatConnection.getMediaType(), connect.MediaType.CHAT);
    });

    it('Should call InitMediaController method on new ChatConnection creation', function () {
      const chatConnection = new connect.ChatConnection(contactId, connectionId);
      expect(initMediaController.calledOnce);
    });

    it('Should return valid chatMedia Info on getMediaInfo method ', function () {
      const chatConnection = new connect.ChatConnection(contactId, connectionId);
      const mediaInfo = chatConnection.getMediaInfo();
      assert.equal(mediaInfo.originalInfo.customerName, chatMediaInfo.customerName);
    });

    it('Should return valid monitor Info on getMonitorInfo method ', function () {
      const chatConnection = new connect.ChatConnection(contactId, connectionId);
      const monitorInfo = chatConnection.getMonitorInfo();
      assert.deepEqual(monitorInfo, chatMonitorInfo);
    });
  });
 
  describe('#Voice Connection API', function () {
 
     const connectionId = "connectionId";
     const contactId = "contactId";
     const initMediaController = sinon.spy();
 
     before(function () {
       connect.core.getClient = sinon.stub();
       connect.core.getAgentDataProvider = sinon.stub().returns({
         getContactData: () => { return {} },
         _initMediaController: initMediaController,
         getConnectionData: () => {
           return {
             state: {},
             getMediaController: () => { }
           }
         },
       })
     });
  
     after(function () {
       initMediaController.resetHistory();
       connect.core.getAgentDataProvider.resetBehavior();
     });
 
     it('Should create new Voice connection Object given the Voice Contact and Connection Id with Speaker Authenticator ', function () {
       const voiceConnection = new connect.VoiceConnection(contactId, connectionId);
       assert.equal(voiceConnection.connectionId, connectionId);
       assert.equal(voiceConnection.contactId, contactId);
       assert.equal(voiceConnection.getMediaType(), connect.MediaType.SOFTPHONE);
       assert.equal(typeof(voiceConnection.getSpeakerId), 'function')
     });
 
     describe('getSpeakerId', function() {
       it('Should return SpeakerId promise.', function () {
         const voiceConnection = new connect.VoiceConnection(contactId, connectionId);
         var speakerId = voiceConnection.getSpeakerId();
         assert.equal(Promise.resolve(speakerId), speakerId);
       });
     });
  });
});

