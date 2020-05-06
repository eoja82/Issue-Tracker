/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const shortid  = require("shortid");
var mongoose    = require('mongoose');

mongoose.set('useFindAndModify', false);  //to use findOneAndUpdate
module.exports = function (app) {

  var issueSchema = new mongoose.Schema({
    _id: {
          type: String,
          default: shortid.generate
      }, 
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    status_text: String,
    open: Boolean,
    _v: false
  });  

  var Issue = mongoose.model("Issue", issueSchema);

    app.route('/api/issues/:project')
      //get all open isues or query and filter
      .get(function (req, res){
        var project = req.query.project;
        var query = req.query;

        //query is empty if no query to filter results so all issues are sent
        Issue.find(query, function(err, docs) { 
            if (err) { console.log(err); }      
            else {
              res.json(docs);
            }
          });        
      })

      //create new issue
      .post(function (req, res){
        var project = req.body;

        if(!project.issue_title || !project.issue_text || !project.created_by) {
          res.send("missing required inputs");
        } else {
        var newIssue = new Issue({
          _id: shortid.generate(), 
          issue_title: project.issue_title,
          issue_text: project.issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: project.created_by,
          assigned_to: project.assigned_to || "",
          status_text: project.status_text || "",
          open: true
        });}
        console.log(newIssue);
        newIssue.save(function(err, doc) {
          if (err) { console.log(err); }
          else {
            console.log("new issue created");
            res.json(doc);
          }
        });
      })

      //update previously created issue
      .put(function (req, res){
        var project = req.body; 
        var id = project._id;
        var updates = {
          issue_title: project.issue_title,
          issue_text: project.issue_text,
          created_by: project.created_by,
          assigned_to: project.assigned_to,
          status_text: project.status_text,
          open: project.open
        };
        if (!project.issue_title) { delete updates.issue_title}
        if (!project.issue_text) { delete updates.issue_text}
        if (!project.created_by) {delete updates.created_by}
        if (!project.assigned_to) {delete updates.assigned_to}
        if (!project.status_text) {delete updates.status_text}
        if (!project.open) {delete updates.open}

        if (Object.keys(updates).length === 0) {
          res.send("no updated field sent");
        } else {
          updates.updated_on = new Date();

        Issue.findOneAndUpdate({_id: id}, updates, {new: true}, function(err, doc) {
          if (err) { 
            console.log(err); 
          } else if (!doc) {
            res.send("could not update " + id)
          } else {
            console.log(doc);
            res.send("Successfully Updated");
          }
        })
      };
      })

      //delete issue
      .delete(function (req, res){
        var id = req.body._id;
        if (!id) {
          res.send("_id error");
        } else {
          Issue.deleteOne({_id: id}, function(err, doc) {
            if (err) {
              console.log(err);         
            } else if (doc.deletedCount === 0) { //no such _id in database
              res.send("could not delete " + id);
            } else {
              console.log(id + " successfully deleted");
              res.send("deleted " + id);
            }
          });
        }
      });
  
};
