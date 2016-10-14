"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Modal = ReactBootstrap.Modal,
    Button = ReactBootstrap.Button,
    Collapse = ReactBootstrap.Collapse,
    ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem;

//we store our recipes in an array of RecipeItem objects
var RecipeItem = function RecipeItem(title, ingredients, instructions) {
	this.title = title || "Untitled";
	this.ingredients = ingredients || ["No ingredients provided"];
	this.instructions = instructions || "No instructions provided";
	this.id = uuid.v4();
};

var recipes = typeof localStorage["localRecipes"] != "undefined" ? JSON.parse(localStorage["localRecipes"]) : [{ title: "Jalapeno Popper Quesadillas", ingredients: ["6 jalapeno peppers -eeded and halved lengthwise", "1 tablespoon butter", "2 (10 inch) flour tortillas", "2 tablespoons cream cheese", "1/2 cup shredded Mexican cheese blend", "3 tortilla chips or more to taste (optional)"], instructions: "Set oven rack about 6 inches from the heat source and preheat the oven's broiler. Line a baking sheet with aluminum foil.\nArrange jalapeno peppers, cut-side down, on the prepared baking sheet.\nBroil jalapeno peppers in the preheated oven until skins are bubbling and blackened, 10 to 15 minutes. Immediately place peppers in a resealable plastic bag; seal. Allow peppers to steam in bag to help loosen skins, about 20 minutes. Carefully open bag, pull skins off peppers, and chop peppers.\nSpread half the butter onto 1 side of each tortilla. Spread half the cream cheese onto the other side of each tortilla. Sprinkle half the jalapeno peppers, half the Mexican cheese blend, and half the tortilla chips over the cream cheese-side of each tortilla. Fold each tortilla in half over the fillings with butter-side on the outside.\nHeat a skillet over medium-low heat; cook 1 quesadilla in the hot skillet until golden brown, 2 to 3 minutes per side. Repeat with second quesadilla." }, { title: "Guacamole", ingredients: ["3 avocados", "1 lime", "1 teaspoon salt", "1/2 cup diced onion", "3 tablespoons chopped fresh cilantro", "2 roma (plum) tomatoes", "1 teaspoon minced garlic", "1 pinch ground cayenne pepper (optional)"], instructions: "In a medium bowl, mash together the avocados, lime juice, and salt. Mix in onion, cilantro, tomatoes, and garlic. Stir in cayenne pepper. Refrigerate 1 hour for best flavor, or serve immediately." }];

recipes = recipes.map(function (val) {
	return new RecipeItem(val.title, val.ingredients, val.instructions);
});

var App = React.createClass({
	displayName: "App",

	getInitialState: function getInitialState() {
		/*visible tracks which recipe we are viewing and showModal tracks if we are viewing a modal and if we are,
  it tracks which recipe we were viewing when we opened the modal if we are editing a recipe. For example if we
  are editing the recipe with id "xyz", showModal's value will be "xyz"*/
		return {
			recipeList: recipes,
			visible: null,
			showModal: false
		};
	},

	handleHeaderClick: function handleHeaderClick(newVisible) {
		//handles opening/closing the recipes
		this.setState({
			visible: this.state.visible === newVisible ? null : newVisible
		});
	},

	close: function close() {
		this.setState({ showModal: false });
	},
	open: function open(whichRecipe) {
		/*tracks which recipe we were viewing when the modal opened. If we were not viewing any recipe we pass the
  value "outter" meaning that we opened the modal by clicking the "Add recipe" button*/
		this.setState({ showModal: whichRecipe });
	},

	addRecipe: function addRecipe(title, ingredients, instructions) {
		//creates a new RecipeItem object and pushes it to the existing recipeList and closes the modal
		var newRecipe = new RecipeItem(title, ingredients ? ingredients.split(',').map(function (val) {
			return val.trim();
		}) : undefined, instructions);
		this.setState({
			visible: null,
			showModal: false,
			recipeList: [].concat(this.state.recipeList, [newRecipe])
		});
	},

	editRecipe: function editRecipe(newTitle, newIngredients, newInstructions, id) {
		/*edits the recipe with the provided unique id. If the user leaves any form fields blank, we are providing
  the default values listed below*/
		var changedRecipe = {
			title: newTitle || "Untitled",
			ingredients: newIngredients ? newIngredients.split(',').map(function (val) {
				return val.trim();
			}) : ["No ingredients provided"],
			instructions: newInstructions || "No instructions provided",
			id: id
		};
		this.setState({
			visible: null,
			showModal: false,
			recipeList: this.state.recipeList.map(function (val) {
				return id !== val.id ? val : changedRecipe;
			})
		});
	},

	deleteRecipe: function deleteRecipe(deleted) {
		//delete's the recipe with id = deleted
		this.setState({
			recipeList: this.state.recipeList.filter(function (val) {
				return val.id !== deleted;
			})
		});
	},

	render: function render() {
		var _this = this;

		localStorage.setItem("localRecipes", JSON.stringify(this.state.recipeList));
		return React.createElement(
			"div",
			null,
			React.createElement(
				"h1",
				{ className: "text-center" },
				"Recipe Book ",
				React.createElement("img", { src: "https://s17.postimg.org/4tj0ievkf/chefs_hat_23436_960_720.png" })
			),
			React.createElement(
				"div",
				{ id: "main" },
				this.state.recipeList.map(function (val) {
					return React.createElement(Recipe, _extends({}, val, {
						close: _this.close,
						deleteRecipe: _this.deleteRecipe,
						handleHeaderClick: _this.handleHeaderClick,
						open: _this.open,
						visible: _this.state.visible
					}));
				}),
				React.createElement(
					Button,
					{
						bsStyle: "primary",
						onClick: this.open.bind(null, "outter") },
					"Add Recipe"
				),
				React.createElement(MyModal, {
					recipeList: this.state.recipeList,
					addRecipe: this.addRecipe,
					close: this.close,
					editRecipe: this.editRecipe,
					showModal: this.state.showModal })
			)
		);
	}
});

function Recipe(props) {
	var handleHeaderClick = props.handleHeaderClick;

	var other = _objectWithoutProperties(props, ["handleHeaderClick"]);

	return React.createElement(
		"div",
		null,
		React.createElement(RecipeHeader, {
			id: props.id,
			title: props.title,
			onClick: handleHeaderClick }),
		React.createElement(RecipeBody, other)
	);
}

function RecipeHeader(props) {
	return React.createElement(
		"div",
		{
			className: "recipeHeader",
			onClick: props.onClick.bind(null, props.id) },
		React.createElement(
			"h2",
			{ className: "text-center" },
			props.title
		)
	);
}

function RecipeBody(props) {
	return React.createElement(
		Collapse,
		{ "in": props.visible === props.id },
		React.createElement(
			"div",
			{ className: "recipe" },
			React.createElement(
				"h3",
				{ className: "text-center" },
				"List of Ingredients"
			),
			React.createElement(
				ListGroup,
				null,
				props.ingredients.map(function (val) {
					return React.createElement(
						ListGroupItem,
						null,
						val
					);
				})
			),
			React.createElement(
				"h3",
				{ className: "text-center" },
				"Instructions"
			),
			React.createElement(
				"p",
				{ className: "instructions" },
				props.instructions
			),
			React.createElement(
				Button,
				{
					bsStyle: "info",
					onClick: props.open.bind(null, props.id) },
				"Edit Recipe"
			),
			React.createElement(
				Button,
				{
					bsStyle: "danger",
					onClick: props.deleteRecipe.bind(null, props.id) },
				"Delete"
			)
		)
	);
}

var MyModal = React.createClass({
	displayName: "MyModal",

	getInitialState: function getInitialState() {
		return {
			title: undefined,
			ingredients: undefined,
			instructions: undefined
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.showModal !== "outter" && nextProps.showModal !== false) {
			var recipeItem = nextProps.recipeList.find(function (val) {
				return val.id === nextProps.showModal;
			});
			this.setState({
				title: recipeItem.title,
				ingredients: recipeItem.ingredients.join(','),
				instructions: recipeItem.instructions
			});
		}
	},

	handleChange: function handleChange(key) {
		return function (e) {
			var state = {};
			state[key] = e.target.value;
			this.setState(state);
		}.bind(this);
	},

	addOrEdit: function addOrEdit() {
		var title = this.state.title,
		    ingredients = this.state.ingredients,
		    instructions = this.state.instructions;
		this.resetState();
		if (this.props.showModal === "outter") {
			this.props.addRecipe(title, ingredients, instructions);
		} else {
			this.props.editRecipe(title, ingredients, instructions, this.props.showModal);
		}
	},

	resetState: function resetState() {
		this.setState({
			title: undefined,
			ingredients: undefined,
			instructions: undefined
		});
	},

	close: function close() {
		this.resetState();
		this.props.close();
	},

	render: function render() {
		return React.createElement(
			Modal,
			{
				show: this.props.showModal,
				onHide: this.close },
			React.createElement(
				Modal.Header,
				null,
				React.createElement(
					Modal.Title,
					null,
					this.props.showModal === "outter" ? "Add a Recipe" : "Edit Recipe"
				)
			),
			React.createElement(
				Modal.Body,
				null,
				React.createElement(
					"h2",
					null,
					"Title"
				),
				React.createElement("input", {
					placeholder: "Enter a title for your recipe.",
					value: this.state.title,
					type: "text",
					onChange: this.handleChange('title') }),
				React.createElement(
					"h2",
					null,
					"Ingredients"
				),
				React.createElement("textarea", {
					placeholder: "Enter the ingredients for your recipe separated by commas.",
					value: this.state.ingredients,
					onChange: this.handleChange('ingredients') }),
				React.createElement(
					"h2",
					null,
					"Instructions"
				),
				React.createElement("textarea", {
					placeholder: "Enter the instructions for your recipe.",
					value: this.state.instructions,
					onChange: this.handleChange('instructions') })
			),
			React.createElement(
				Modal.Footer,
				null,
				React.createElement(
					Button,
					{
						bsStyle: "primary",
						onClick: this.addOrEdit },
					this.props.showModal === "outter" ? "Add Recipe" : "Edit Recipe"
				),
				React.createElement(
					Button,
					{ onClick: this.close },
					"Close"
				)
			)
		);
	}

});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));