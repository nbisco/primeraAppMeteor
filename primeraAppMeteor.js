Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  
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

      Tasks.insert({
        text: texto.value,
        createdAt: new Date()
      });

      texto.value = "";

      return false;
    },
    "change .hide-completed input": function(e) {
      Session.set("hideCompleted", e.target.checked);
    }
  });

  Template.task.events({
    "click .delete": function() {
      Tasks.remove(this._id);
    },

    "click .toggle-checked": function() {
      var itasks = document.getElementById('iTasks');
      Tasks.update(this._id, {$set:{checked: !this.checked}});
      itasks.style.backgroundColor = 'red';
      setTimeout(function() {
        itasks.style.backgroundColor = '';
      }, 200);
    }
  });
}