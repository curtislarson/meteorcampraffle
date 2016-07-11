Meteor.methods({
  getOrderIds: function() {
    var users = Assets.getText("users.csv");
    var csvParseSync = Meteor.wrapAsync(CSVParse);
    var output;
    try {
      output = csvParseSync(users, { columns: true });
    } catch (error) {
      throw new Meteor.Error('csv-parse-fail', error.message);
    }
    return output.map(function(item) {
      return item["Order Reference"];
    });
  },

  getEmail: function(orderId) {
    var users = Assets.getText("users.csv");
    var csvParseSync = Meteor.wrapAsync(CSVParse);
    var output;
    try {
      output = csvParseSync(users, { columns: true });
    } catch (error) {
      throw new Meteor.Error('csv-parse-fail', error.message);
    }

    for (var i = 0; i < output.length; i++) {
      if (output[i]["Order Reference"] === orderId) {
        return output[i]["Ticket First Name"] + " " +
          output[i]["Ticket Last Name"] + " (" + output[i]["Ticket Email"] + ")";
      }
    }
    return "Unknown Order Id";
  },
});
