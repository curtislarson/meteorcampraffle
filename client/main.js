import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var OrderIds = [];
var Winner = new ReactiveVar(null);
var CurrentSpin = new ReactiveVar(null);
var clear;
var speed = 25;
var numberOfRuns = 0;

Template.body.onRendered(function() {
  Meteor.call("getOrderIds", function(err, orderIds) {
    OrderIds = orderIds;
  });
});

Template.spinner.helpers({
  winner: function() {
    return Winner.get();
  },
  currentSpin: function() {
    return CurrentSpin.get();
  },
});

Template.spinner.events({
  "click .spin-button": function(e) {
    Winner.set(null);
    shuffle(OrderIds);
    runLotto();
  },
});


function runLotto() {
  numberOfRuns = 0;
  speed = 5;
  clear = Meteor.setInterval(runFunction, speed);
}

function runFunction() {
  CurrentSpin.set(OrderIds[numberOfRuns]);
  numberOfRuns++;
  if (numberOfRuns > 320 && speed !== 150) {
    speed = 150;
    Meteor.clearInterval(clear);
    clear = Meteor.setInterval(runFunction, speed);
  }
  if (numberOfRuns >= OrderIds.length) {
    Meteor.clearInterval(clear);
    CurrentSpin.set(null);
    var winner = OrderIds[numberOfRuns - 1];
    Meteor.call("getEmail", winner, function(err, email) {
      Winner.set(email);
    });
  }
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}