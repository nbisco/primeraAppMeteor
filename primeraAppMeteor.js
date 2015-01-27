Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Meteor.subscribe("tasks");
  
  Template.body.helpers({
    tasks: function() {
      if(Session.get("hideCompleted")) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    incompleteTasks: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function(event) {
      var texto = event.target.text;
      Meteor.call("insertTask", texto.value);
      texto.value = "";
      return false;
    },
    "change .hide-completed input": function(e) {
      Session.set("hideCompleted", e.target.checked);
    }
  });

  Template.task.events({
    "click .delete": function () {
      Meteor.call("removeTask",this._id);
      resaltarCambio();
    },

    "click .toggle-checked": function() {
      Meteor.call("setChecked", this._id, !this.checked);
      resaltarCambio();     
    }
  });

  //Configuracion de la interfaz de cuentas de usuarios.-
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  insertTask: function (texto) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.insert({
        text: texto,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
    });
  },
  removeTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, {$set: {checked: setChecked}});
  }
});

//funciones javascript "comunes".-
function resaltarCambio () {
  var itasks = document.getElementById('iTasks');

  itasks.style.backgroundColor = 'red';
  setTimeout(function() {
    itasks.style.backgroundColor = '';
  }, 200);
}

if (Meteor.isServer) {
  Meteor.publish("tasks", function() {
    return Tasks.find();
  });
}