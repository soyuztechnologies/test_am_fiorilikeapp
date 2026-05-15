sap.ui.define(
    ["am/hr/payroll/controller/BaseController",
     "sap/m/MessageBox",
     "sap/m/MessageToast",
     "sap/ui/core/Fragment",
     "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    function(BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator) {
        return BaseController.extend("am.hr.payroll.controller.View2", {

            onInit: function(){

                var oRouter = this.giveNavigation();
                //attach a new RMH method and pass our controller object to the method
                oRouter.getRoute("superman").attachMatched(this.herculis, this);

            },
            onSelTableRow: function(oEvent){

                var oSelectedItem = oEvent.getParameter("listItem");
                var sPath = oSelectedItem.getBindingContextPath();
                var sIndex = sPath.split("/")[sPath.split("/").length - 1];

                // if (condition) {
                //     navTo
                // }
                this.giveNavigation().navTo("baloo",{
                    suppId: sIndex
                });
            },
            herculis: function(oEvent){
                
                //extract the path variable from route end point
                var sIndex = oEvent.getParameter("arguments").path;
                //rebuild the element path - which was selected by user
                var sPath = '/' + sIndex;
                //Bind the element with the view
                this.getView().bindElement(sPath,{
                    expand: "To_Supplier"
                });

            },
            onSave: function(){
                MessageBox.confirm("Are you ready?",{
                    title: "Closure",
                    onClose: this.onMsgClose.bind(this)
                });
            },
            onMsgClose: function(result){
                //MessageBox.success(result);
                if(result === "OK"){
                    var oResourceModel = this.getOwnerComponent().getModel("i18n");
                    var sMsg = oResourceModel.getResourceBundle().getText("msg")
                    MessageToast.show(sMsg);
                }
            },
            //here is the definition of the global variable
            oSupplierPopup: null,
            oCityPopup: null,
            onFilter: function(){
                //because in our callback instead of this, we can use that as controller object to access global variable
                var that = this;
                //if lo_alv is not initial in the PBO
                if(!that.oSupplierPopup){
                    Fragment.load({
                        fragmentName: 'am.hr.payroll.fragments.popup',
                        type: 'XML',
                        id: 'supplier',
                        //we must pass controller object to fragment to later handle events of the fragment
                        controller: this
                    }).then(function(oFragment){
                        //here we cannot access this pointer as controller object, we have to create a local variable
                        //that points to controller object
                        that.oSupplierPopup = oFragment;
                        that.oSupplierPopup.bindAggregation("items",{
                            path: '/supplier',
                            template: new sap.m.StandardListItem({
                                icon: 'https://cdn-icons-png.flaticon.com/512/10753/10753547.png',
                                title: '{name}',
                                description: '{sinceWhen} {city}'
                            })
                        });
                        //allowing fragment to get access of model
                        //immunity system allows parasite to give access of body components
                        that.getView().addDependent(that.oSupplierPopup);
                        that.oSupplierPopup.open();
                        

                    });
                }else{
                    that.oSupplierPopup.open();
                }               
                
            },
            oField: null,
            onF4Help: function(oEvent){
                //snapshot of the field inside table cell on which f4 was pressed
                this.oField = oEvent.getSource();
                //because in our callback instead of this, we can use that as controller object to access global variable
                var that = this;
                //if lo_alv is not initial in the PBO
                if(!that.oCityPopup){
                    Fragment.load({
                        fragmentName: 'am.hr.payroll.fragments.popup',
                        type: 'XML',
                        id: 'city',
                        //we must pass controller object to fragment to later handle events of the fragment
                        controller: this
                    }).then(function(oFragment){
                        //here we cannot access this pointer as controller object, we have to create a local variable
                        //that points to controller object
                        that.oCityPopup = oFragment;
                        that.oCityPopup.bindAggregation("items",{
                            path: '/cities',
                            template: new sap.m.StandardListItem({
                                icon: 'https://cdn-icons-png.freepik.com/512/9378/9378329.png',
                                title: '{name}',
                                description: '{state} {population}'
                            })
                        });
                        that.oCityPopup.setMultiSelect(false);
                        //allowing fragment to get access of model
                        //immunity system allows parasite to give access of body components
                        that.getView().addDependent(that.oCityPopup);
                        that.oCityPopup.open();
                        

                    });
                }else{
                    that.oCityPopup.open();
                }
            },
            onConfirm: function(oEvent){
                var sId = oEvent.getSource().getId();
                if (sId.indexOf("city") !== -1) {
                    this.oField.setValue(oEvent.getParameter("selectedItem").getTitle());
                }else{
                    var aFilters = [];
                    var aSelections = oEvent.getParameter("selectedItems");
                    for(let i=0; i<aSelections.length;i++){
                        let oItem = aSelections[i];
                        var oFilter = new Filter("name", FilterOperator.EQ,oItem.getTitle() );
                        aFilters.push(oFilter);
                    }

                    var oFilterFinal = new Filter({
                        filters: aFilters,
                        and: false
                    });

                    this.getView().byId("zkas").getBinding("items").filter(oFilterFinal);

                }
            },
            onCancelFilter: function(){
                this.getView().byId("zkas").getBinding("items").filter([]);
            },
            onCancel: function(){
                MessageBox.error("Woha! that was not cool!");
            },
            onBack: function(){
                this.back();
            }
        });
    }
);