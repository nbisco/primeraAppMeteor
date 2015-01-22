Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  
  Template.body.helpers({
    tasks: function() {
      return Tasks.find({}, {sort: {createdAt: -1}});
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
  });

  Template.task.events({
    "click .delete": function() {
      Tasks.remove(this._id);
    },

    "click .toggle-checked": function() {
      Tasks.update(this._id, {$set:{checked: !this.checked}});
    }
  });
}