sap.ui.define(
    ["am/hr/payroll/controller/BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/ObjectListItem",
        "sap/m/ObjectStatus"
    ],
    function (BaseController, Filter, FilterOperator, ObjectListItem, ObjectStatus) {
        return BaseController.extend("am.hr.payroll.controller.View1", {
            flag: false,
            //called only once when the controller object is created
            onInit: function () {
                var oRouter = this.giveNavigation();
                //attach a new RMH method and pass our controller object to the method
                //Inform sap ui5, hey, whenever the route superman is loaded
                //please call my sparta function, on routhe match handler
                oRouter.getRoute("superman").attachMatched(this.sparta, this);

                //Aggregation binding with dynamic syntax
                var oList = this.getView().byId("myList");

                oList.setGrowing(true).setGrowingThreshold(10);
                //Bind aggregation
                ///,.....code here to calculate something
                if (this.flag) {
                    oList.bindAggregation("items", {
                        path: '/ProductSet',
                        template: new ObjectListItem({
                            title: "{PRODUCT_ID}",
                            intro: "{CATEGORY}",
                            number: "{PRICE}",
                            numberUnit: "{CURRENCY_CODE}",
                            icon: "sap-icon://product",
                            firstStatus: new ObjectStatus({
                                text: {
                                    path: 'TYPE_CODE'
                                }
                            })
                        })
                    });
                } else {
                    oList.bindAggregation("items", {
                        path: '/ProductSet',
                        template: new ObjectListItem({
                            title: "{PRODUCT_ID}",
                            intro: "{CATEGORY}",
                            number: "{PRICE}",
                            numberUnit: "Unknown",
                            icon: "sap-icon://product",
                            firstStatus: new ObjectStatus({
                                text: {
                                    path: 'TYPE_CODE'
                                }
                            })
                        })
                    });
                }

            },
            onAdd: function(){
                this.giveNavigation().navTo("add")
            },
            //custom function where i can do what i want
            //trigger point when route change
            //here, i will do the selection change on fly
            sparta: function (oEvent) {
                
                //extract the path variable from route end point
                var sIndex = oEvent.getParameter("arguments").path;
                //How to obtain the item object
                var oItemObject = null;
                var aItems = this.getView().byId("myList").getItems();
                for (let i = 0; i < aItems.length; i++) {
                    if (i === parseInt(sIndex)) {
                        oItemObject = aItems[i];
                        break;
                    }
                }
                //Select the index in the list on-fly
                //our goal is to select an item, not fetch the selected item
                if (oItemObject) {
                    this.getView().byId("myList").setSelectedItem(oItemObject);
                }

            },
            onGoToView2: function (sIndex) {

                //Who should do all navigation
                this.giveNavigation().navTo("superman", {
                    path: sIndex
                })

                // //Get the current view object
                // var oView = this.getView();
                // //Get the parent of the view object which is App
                // var oApp = oView.getParent().getParent();
                // //Navigate to View2
                // //https://ui5.sap.com/#/api/sap.m.NavContainer%23methods/to
                // oApp.toDetail("idView2");
            },
            //Step 2: define a new event handler to manage the element binding and navigation to View2
            onSelectItem: function (oEvent) {
                //Step 1: Get the selected item from the event parameter
                //var oSelectedItem = oEvent.getSource().getSelectedItem();
                var oSelectedItem = oEvent.getParameter("listItem");
                debugger;
                //Step 2: Get the binding context of the selected item - get path of memory of element
                var sPath = oSelectedItem.getBindingContextPath();
                //Step 3: Store the path in the global variable defined in the BaseController
                this.memoryPathSel = sPath;

                //sPath= /fruits/index
                //extract the index form here
                var sIndex = sPath.split("/")[sPath.split("/").length - 1];

                //Step 4: Go to parent and get access of view2 object
                // var oMasterSection = this.getView().getParent();
                // var oSplitApp = oMasterSection.getParent()
                // var oView2 = oSplitApp.getDetailPage("idView2");
                // //Step 5: Bind the element of view2 with the path stored in the global variable
                // oView2.bindElement(this.memoryPathSel);

                this.onGoToView2(sIndex);
            },
            onDelete: function () {
                //Step 1: Get the list object
                var oList = this.getView().byId("myList");
                //Step 2: Get the selected items from the list
                var aSelectedItems = oList.getSelectedItems();
                //Step 3: Loop through the selected items and delete them
                for (var i = 0; i < aSelectedItems.length; i++) {
                    oList.removeItem(aSelectedItems[i]);
                }
            },
            onSearch: function (oEvent) {
                //Step 1: Get the search query from the search field
                var sQuery = oEvent.getParameter("query");
                //Step 2: Get the list object
                var oList = this.getView().byId("myList");
                //Step 3: Construct a filter object to filter the list items based on the search query
                var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sQuery);
                // var oFilter2 = new Filter("taste", FilterOperator.Contains, sQuery);

                // var aFilters = [oFilter1, oFilter2];

                // //new filter with multiple filters and OR condition
                // var oCombinedFilter = new Filter({
                //     filters: aFilters,
                //     and: false
                // });
                //Step 4: Apply the filter to the list binding
                oList.getBinding("items").filter(oFilter1);
                //oList.getBinding("items").filter(oFilter1).filter(oFilter2);
            }

        });
    }
);