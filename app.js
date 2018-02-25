// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return {
        storeItem: function(item){
            let items = [];
            if(localStorage.getItem('items')){
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
            } else {
                items.push(item);
            }
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItemStorage: function(item){
            let items = JSON.parse(localStorage.getItem('items'));
            items.splice(items.indexOf(item.id), 1, item);
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            const index = items.map(item => item.id).indexOf(id);
            items.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage: function(){
            if (localStorage.getItem('items')){
                return JSON.parse(localStorage.getItem('items'));
            } else {
                return [];
            }
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    // Public Methods
    return {
        logData: function(){
            return data;
        },
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Calories to number
            calories = parseInt(calories);
            const newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function(){
            data.totalCalories = data.items.reduce((total, item) => total + item.calories, 0);
            return data.totalCalories;
        },
        getItemById: function(id){
            return data.items.find(item => item.id === id)
        },
        updateItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            data.items.splice(data.items.map(item => item.id).indexOf(id),1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        }
    }
})();

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list>li',
        btnGroup: '.btn-group',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    // Public Methods
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }

        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Append the LI template string to current list
            document.querySelector(UISelectors.itemList).innerHTML +=
                `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`;
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn Node List into array
            listItems = Array.from(listItems);
            let itemToUpdate = listItems.find(listItem => listItem.getAttribute('id') === `item-${item.id}`);
            document.querySelector('#' + itemToUpdate.getAttribute('id')).innerHTML = `
                <strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
        },
        deleteListItem: function(id){
            document.querySelector(`#item-${id}`).remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(item => item.remove());
            UICtrl.hideList();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            // Clear inputs
            UICtrl.clearInput();
            // Create Add button
            const addBtn = document.createElement('button');
            addBtn.classList = 'add-btn btn blue darken-3';
            addBtn.innerHTML = `<i class="fa fa-plus"></i> Add Meal`;
            // Hide Delete and Back buttons
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'; 
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            // Replace Update with Add button
            const btnGroup = document.querySelector(UISelectors.btnGroup);
            btnGroup.replaceChild(addBtn, btnGroup.childNodes[0]);
        },
        showEditState: function(){
            // Create Update Button
            const updateBtn = document.createElement('button');
            updateBtn.classList = 'update-btn btn orange';
            updateBtn.innerHTML = `<i class="fa fa-pencil-square-o"></i> Update Meal`;
            // Show Delete and Back buttons
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            // Replace Add with Update button
            const btnGroup = document.querySelector(UISelectors.btnGroup);
            btnGroup.replaceChild(updateBtn, btnGroup.childNodes[0]);
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// App  Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', backBtnEvent);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item submit
    const itemAddSubmit = function(e){
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        // Validation of inputs
        if (/\w/.test(input.name) && /^[0-9]+$/.test(input.calories)){
            // Add item to array
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in local storage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // Update item submit
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get ID number from string 'item-#'
            const itemId = parseInt(e.target.parentNode.parentNode.id.substring(5));
            // Get item
            const itemToEdit = ItemCtrl.getItemById(itemId);
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();

            // Show edit state
            UICtrl.showEditState();
            // Get UI Selectors
            const UISelectors = UICtrl.getSelectors();
            // Load event listener for update button
            document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        }
        e.preventDefault();
    }

    // Item update submit
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();
        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // Update UI
        UICtrl.updateListItem(updatedItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // Update in local storage
        StorageCtrl.updateItemStorage(updatedItem);
        // Switch back to old state
        UICtrl.clearEditState();
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        e.preventDefault();
    }

    // Item Delete submit
    const itemDeleteSubmit = function(e){
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        // Go back
        UICtrl.clearEditState();
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        e.preventDefault();
    }

    // Back button event
    const backBtnEvent = function(e){
        UICtrl.clearEditState();
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        e.preventDefault();
    }

    // Clear items event
    const clearAllItemsClick = function(e){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        // Remove from UI
        UICtrl.removeItems();
        // Remove from local storage
        StorageCtrl.clearItemsFromStorage();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Show total calories
        UICtrl.showTotalCalories(totalCalories);

    }
    
    // Public Methods
    return {
        init: function(){
            // Set initial state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if there are any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);


            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);


// initialize app
App.init();