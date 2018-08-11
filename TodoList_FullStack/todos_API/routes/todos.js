var express = require("express");
var router = express.Router();
var db = require("../models");
var helpers = require("../helpers/todos");

// router.get("/", function(req, res){
//     db.Todo.find()
//     .then(function(todos){
//         res.json(todos);
//     })
//     .catch(function(err){
//         res.send(err);
//     });
// })

// router.post("/", );

router.route("/")
.get(helpers.getTodos)
.post(helpers.createTodo)

// router.get("/:todoId", function(req, res){
//   db.Todo.findById(req.params.todoId)
//   .then(function(foundTodo){
//       res.json(foundTodo);
//   })
//   .catch(function(err){
//       res.send(err);
//   })
// })

// router.put("/:todoId", );

router.route("/:todoId")
.get(helpers.getTodo)
.put(helpers.updateTodo)
.delete(helpers.deleteTodo)


module.exports = router;