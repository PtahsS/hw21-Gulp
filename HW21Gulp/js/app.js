"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Model = /*#__PURE__*/function () {
  function Model(baseUrl, userLogin) {
    _classCallCheck(this, Model);

    _defineProperty(this, "baseUrl", void 0);

    _defineProperty(this, "userLogin", void 0);

    _defineProperty(this, "token", void 0);

    _defineProperty(this, "notes", []);

    this.baseUrl = baseUrl;
    this.userLogin = userLogin;
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  _createClass(Model, [{
    key: "auth",
    value: function auth(init) {
      var _this = this;

      fetch("".concat(this.baseUrl, "/auth/login"), {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: this.userLogin
        })
      }).then(function (response) {
        return response.json();
      }).then(function (_ref) {
        var access_token = _ref.access_token;
        _this.token = access_token;
        init();
      });
    }
  }, {
    key: "init",
    value: function init(onchanged) {
      var _this2 = this;

      fetch("".concat(this.baseUrl, "/todo"), {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        }
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.notes = data;

        _this2.notes.map(function (note) {
          note.value = JSON.parse(note.value);
        });

        console.log('Init is done');
        console.log(_this2.notes);
        onchanged(_this2.notes);
      });
    }
  }, {
    key: "bindTodoListChanged",
    value: function bindTodoListChanged(callback) {
      this.onTodoListChanged = callback;
    }
  }, {
    key: "addTodo",
    value: function addTodo(todoText) {
      var _this3 = this;

      var arrText = todoText.split(', ');
      var value = JSON.stringify({
        name: arrText[0],
        content: arrText[1]
      });
      fetch("".concat(this.baseUrl, "/todo"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        },
        body: JSON.stringify({
          value: value,
          priority: 1
        })
      }).then(function (response) {
        if (response.status >= 200 && response.status <= 210) {
          console.log('Added');
        } else {
          throw new Error('Error add');
        }

        return response;
      }).then(function (response) {
        return response.json();
      }).then(function (note) {
        note = {
          _id: note._id,
          user: note.user,
          value: JSON.parse(note.value),
          checked: note.checked,
          addedAt: note.addedAt
        };

        _this3.notes.push(note);

        _this3.onTodoListChanged(_this3.notes);
      });
    }
  }, {
    key: "editTodo",
    value: function editTodo(id, updatedText) {
      var _this4 = this;

      var arrText = updatedText.split(', ');
      var value = JSON.stringify({
        name: arrText[0],
        content: arrText[1]
      });
      fetch("".concat(this.baseUrl, "/todo/").concat(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        },
        body: JSON.stringify({
          value: value,
          priority: 1
        })
      }).then(function (response) {
        if (response.status >= 200 && response.status <= 210) {
          console.log('Edited');
        } else {
          throw new Error('Error edit');
        }

        return response;
      }).then(function (response) {
        return response.json();
      }).then(function (note) {
        note = {
          _id: note._id,
          user: note.user,
          value: JSON.parse(note.value),
          checked: note.checked,
          addedAt: note.addedAt
        };
        _this4.notes = _this4.notes.map(function (n) {
          if (n._id === note._id) {
            n = note;
          }

          return n;
        });

        _this4.onTodoListChanged(_this4.notes);
      });
    }
  }, {
    key: "deleteTodo",
    value: function deleteTodo(id) {
      var _this5 = this;

      console.log('model delete');
      fetch("".concat(this.baseUrl, "/todo/").concat(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        }
      }).then(function (response) {
        if (response.status >= 200 && response.status <= 210) {
          console.log('Deleted');
        } else {
          throw new Error('Error delete');
        }

        _this5.notes = _this5.notes.filter(function (note) {
          return note._id != id;
        });

        _this5.onTodoListChanged(_this5.notes);
      });
    }
  }, {
    key: "toggleTodo",
    value: function toggleTodo(id) {
      var _this6 = this;

      fetch("".concat(this.baseUrl, "/todo/").concat(id, "/toggle"), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(this.token)
        }
      }).then(function (response) {
        if (response.status >= 200 && response.status <= 210) {
          _this6.notes = _this6.notes.map(function (n) {
            if (n._id == id) n.checked = !n.checked;
            return n;
          });
          console.log('y', _this6.notes);

          _this6.onTodoListChanged(_this6.notes);
        } else {
          throw new Error('Error toggle');
        }
      });
    }
  }]);

  return Model;
}();

;

var View = /*#__PURE__*/function () {
  function View() {
    _classCallCheck(this, View);

    _defineProperty(this, "showChecked", true);

    this.app = this.getElement('#root');
    this.form = this.createElement('form');
    this.input = this.createElement('input', 'input-note');
    this.input.type = 'text';
    this.input.placeholder = 'Одесса, герой';
    this.input.id = 'todo';
    this.label = this.createElement('label');
    this.label.setAttribute('for', 'todo');
    this.label.textContent = 'Введите название города и его образ через запятую';
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Добавить';
    this.toggleNotesButton = this.createElement('button');
    this.toggleNotesButton.textContent = 'Спрятать выделенные';
    this.toggleNotesButton.id = 'show-toggled-button';
    this.form.append(this.label, this.input, this.submitButton, this.toggleNotesButton);
    this.title = this.createElement('h1');
    this.title.textContent = 'Заметки';
    this.todoList = this.createElement('ul', 'todo-list');
    this.app.append(this.title, this.form, this.todoList);
    this._temporaryTodoText = '';
  }

  _createClass(View, [{
    key: "_resetInput",
    value: function _resetInput() {
      this.input.value = '';
    }
  }, {
    key: "createElement",
    value: function createElement(tag, className) {
      var element = document.createElement(tag);
      if (className) element.classList.add(className);
      return element;
    }
  }, {
    key: "getElement",
    value: function getElement(selector) {
      var element = document.querySelector(selector);
      return element;
    }
  }, {
    key: "displayTodos",
    value: function displayTodos(notes) {
      var _this7 = this;

      // Delete all nodes
      while (this.todoList.firstChild) {
        this.todoList.removeChild(this.todoList.firstChild);
      } // Show default message


      if (notes.length === 0) {
        var p = this.createElement('p');
        p.textContent = 'Заметок нет. Добавьте их!';
        this.todoList.append(p);
      } else {
        // Create notes
        notes.forEach(function (note) {
          var li = _this7.createElement('li');

          li.dataset.checked = note.checked;
          li.classList.add('list-item');
          li.id = note._id;

          var span = _this7.createElement('span', 'value');

          span.contentEditable = true;
          span.classList.add('editable');

          if (note.checked) {
            var strike = _this7.createElement('s');

            strike.textContent = "\u042D\u0442\u043E ".concat(note.value.name, ". \u0413\u043E\u0440\u043E\u0434 ").concat(note.value.content);
            span.append(strike);
          } else {
            span.textContent = "\u042D\u0442\u043E ".concat(note.value.name, ". \u0413\u043E\u0440\u043E\u0434 ").concat(note.value.content);
          }

          var checkedButton = _this7.createElement('button', 'toggle-button');

          checkedButton.textContent = 'Выполненные';

          var deleteButton = _this7.createElement('button', 'delete');

          deleteButton.textContent = 'Удалить';
          deleteButton.classList.add('delete-button');
          li.append(span, checkedButton, deleteButton); // Append notes

          _this7.todoList.append(li);
        });
      }
    }
  }, {
    key: "_initLocalListeners",
    value: function _initLocalListeners() {
      var _this8 = this;

      this.todoList.addEventListener('input', function (event) {
        if (event.target.className === 'editable') {
          _this8._temporaryTodoText = event.target.innerText;
        }
      });
    }
  }, {
    key: "bindAddTodo",
    value: function bindAddTodo(handler) {
      var _this9 = this;

      this.form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (_this9._todoText) {
          handler(_this9._todoText);

          _this9._resetInput();
        }
      });
    }
  }, {
    key: "bindShowCheckedNotes",
    value: function bindShowCheckedNotes(handler) {
      var _this10 = this;

      var showCheckedNotesButton = this.getElement('#show-toggled-button');
      showCheckedNotesButton.addEventListener('click', function () {
        _this10.showChecked = !_this10.showChecked;
        showCheckedNotesButton.innerHTML = _this10.showChecked ? 'Спрятать выделенные' : 'Показать выделенные';
        var checkedNotes = document.querySelectorAll('[data-checked]');

        var _iterator = _createForOfIteratorHelper(checkedNotes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;

            if (item.getAttribute('data-checked') === 'true' && !_this10.showChecked) {
              item.closest('.list-item').classList.add('hide');
            } else {
              item.closest('.list-item').classList.remove('hide');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
    }
  }, {
    key: "bindDeleteTodo",
    value: function bindDeleteTodo(handler) {
      // Удалить заметку
      var $deleteNote = document.querySelectorAll(".delete-button");

      for (var i = 0; i < $deleteNote.length; i++) {
        $deleteNote[i].addEventListener('click', function (e) {
          e.preventDefault();
          var id = this.closest('.list-item').id;
          console.log(id);
          handler(id);
        });
      }

      ;
    }
  }, {
    key: "bindEditTodo",
    value: function bindEditTodo(handler) {
      var _this11 = this;

      this.todoList.addEventListener('focusout', function (event) {
        if (_this11._temporaryTodoText) {
          var id = parseInt(event.target.parentElement.id);
          handler(id, _this11._temporaryTodoText);
        }
      });
    }
  }, {
    key: "bindToggleTodo",
    value: function bindToggleTodo(handler) {
      var $toggleNote = document.querySelectorAll(".toggle-button");

      for (var i = 0; i < $toggleNote.length; i++) {
        $toggleNote[i].addEventListener('click', function (e) {
          e.preventDefault();
          var id = this.closest('.list-item').id;
          console.log(id);
          handler(id);
        });
      }
    }
  }, {
    key: "_todoText",
    get: function get() {
      return this.input.value;
    }
  }]);

  return View;
}();

;

var Controller = function Controller(model, view) {
  var _this12 = this;

  _classCallCheck(this, Controller);

  _defineProperty(this, "onInit", function () {
    _this12.model.init(_this12.onTodoListChanged);
  });

  _defineProperty(this, "onTodoListChanged", function (notes) {
    _this12.view.displayTodos(notes);

    _this12.handlers();
  });

  _defineProperty(this, "handlers", function () {
    _this12.view._initLocalListeners();

    _this12.view.bindDeleteTodo(_this12.handleDeleteTodo);

    _this12.view.bindEditTodo(_this12.handleEditTodo);

    _this12.view.bindToggleTodo(_this12.handleToggleTodo);
  });

  _defineProperty(this, "handleAddTodo", function (todoText) {
    _this12.model.addTodo(todoText);
  });

  _defineProperty(this, "handleShowCheckedNotes", function (notes) {
    onShowCheckedNotes(notes);
  });

  _defineProperty(this, "handleEditTodo", function (id, todoText) {
    _this12.model.editTodo(id, todoText);
  });

  _defineProperty(this, "handleDeleteTodo", function (id) {
    _this12.model.deleteTodo(id);
  });

  _defineProperty(this, "handleToggleTodo", function (id) {
    _this12.model.toggleTodo(id);
  });

  this.model = model;
  this.view = view; //     // Explicit this binding

  this.model.bindTodoListChanged(this.onTodoListChanged);
  this.view.bindAddTodo(this.handleAddTodo);
  this.view.bindShowCheckedNotes(this.handleShowCheckedNotes);
  this.model.auth(this.onInit);
};

;
var app = new Controller(new Model('https://todo.hillel.it', 'ptahs'), new View());