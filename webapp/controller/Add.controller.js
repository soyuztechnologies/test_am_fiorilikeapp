sap.ui.define(
    ["am/hr/payroll/controller/BaseController",
     "sap/ui/model/json/JSONModel",
     "sap/m/MessageBox",
     "sap/m/MessageToast",
     "sap/ui/core/Fragment"
    ],
    function(BaseController, JSONModel, MessageBox, MessageToast, Fragment) {
        return BaseController.extend("am.hr.payroll.controller.Add", {
            
            oLocalModel: null,
            onInit: function(){

                this.oLocalModel = new JSONModel();
                this.oLocalModel.setData(
                    {
                        "prodData": {
                                            "PRODUCT_ID": "",
                                            "TYPE_CODE": "PR",
                                            "CATEGORY": "Notebooks",
                                            "NAME": "",
                                            "DESCRIPTION": "",
                                            "SUPPLIER_ID": "0100000051",
                                            "SUPPLIER_NAME": "TECUM",
                                            "TAX_TARIF_CODE": "1 ",
                                            "MEASURE_UNIT": "EA",
                                            "PRICE": "0.00",
                                            "CURRENCY_CODE": "USD",
                                            "DIM_UNIT": "CM",
                                            "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/AM-1010.jpg"
                                    }
                    }
                );
                this.getView().setModel(this.oLocalModel, "rosa");

                //Step 3: get the odata model object
                this.oDataModel = this.getOwnerComponent().getModel();
            },
            onDelete: function(){
                MessageBox.confirm("please confirm the delete for product",{
                    title: 'Delete Confirmation',
                    onClose: this.onConfirmDelete.bind(this)
                });
            },
            onConfirmDelete: function(state){
                var that = this;
                let payload = this.oLocalModel.getProperty("/prodData");
                if (state === "OK") {
                    this.oDataModel.remove("/ProductSet('" + payload.PRODUCT_ID + "')",{
                        success: function(){
                            MessageToast.show("The product was deleted");
                            that.onClear();
                        }
                    });
                }
            },
            onLoadExpensive: function(){
                var that = this;
                this.oDataModel.callFunction("/GetMostExpensiveProduct",{
                    success: function(data){
                        that.oLocalModel.setProperty("/prodData",data);
                        //send our controller object also to the method which will be set as this
                        that.setMode("Update").bind(that);
                    }
                });
            },

            oSupplierPopup: null,
            oField: null,
            onF4Help: function(oEvent){
                //snapshot of the field inside table cell on which f4 was pressed
                this.oField = oEvent.getSource();
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
                            path: '/SupplierSet',
                            template: new sap.m.StandardListItem({
                                icon: 'sap-icon://supplier',
                                title: '{BP_ID}',
                                description: '{COMPANY_NAME} {CITY}'
                            })
                        });
                        that.oSupplierPopup.setMultiSelect(false);
                        //allowing fragment to get access of model
                        //immunity system allows parasite to give access of body components
                        that.getView().addDependent(that.oSupplierPopup);
                        that.oSupplierPopup.open();
                        

                    });
                }else{
                    that.oSupplierPopup.open();
                }
            },
            onConfirm: function(oEvent){
                var sId = oEvent.getSource().getId();
                this.oField.setValue(oEvent.getParameter("selectedItem").getTitle());
            },
            onClear: function(){
                this.oLocalModel.setProperty("/prodData",{
                                            "PRODUCT_ID": "",
                                            "TYPE_CODE": "PR",
                                            "CATEGORY": "Notebooks",
                                            "NAME": "",
                                            "DESCRIPTION": "",
                                            "SUPPLIER_ID": "0100000051",
                                            "SUPPLIER_NAME": "TECUM",
                                            "TAX_TARIF_CODE": "1 ",
                                            "MEASURE_UNIT": "EA",
                                            "PRICE": "0.00",
                                            "CURRENCY_CODE": "USD",
                                            "DIM_UNIT": "CM",
                                            "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/AM-1010.jpg"
                                    }
                );
                this.setMode("Create");
            },
            mode: "Create",
            setMode: function(sMode){
                this.mode = sMode;
                if (this.mode === "Update") {
                    this.getView().byId("prodId").setEnabled(false);
                    this.getView().byId("idCreate").setText("Update");
                }else{
                    this.getView().byId("prodId").setEnabled(true);
                    this.getView().byId("idCreate").setText("Create");                    
                }
            },
            onEnter: function(oEvent){
                var that = this;
                const sUri = this.getOwnerComponent()
                                    .getManifestEntry("sap.app")
                                    .dataSources
                                    .appliedService
                                    .uri;
                //Step 1: read the value user type in product id
                var sVal = oEvent.getParameter("value");
                //Step 2: send call to backend to load data
                this.oDataModel.read("/ProductSet('" + sVal + "')", {
                    success: function(data){
                        that.oLocalModel.setProperty("/prodData",data);

                        
                        //load image
                        that.getView().byId("myImg").setSrc(
                            sUri + "ProductImgSet('" + data.PRODUCT_ID + "')/$value"
                        );
                        //send our controller object also to the method which will be set as this
                        that.setMode("Update").bind(that);

                    }
                });



            },
            onCreate: function(){
                //Step 1: get the data which needs to be sent to sap
                var payload = this.oLocalModel.getProperty("/prodData");
                //Step 2: if you want to validate you can
                if (!payload.PRODUCT_ID) {
                    MessageBox.error("Woha, please pass product id");
                    return "";   
                }

                if (this.mode === "Update") {
                    //Step 3: use odata to call sap to create data
                    this.oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload, {
                        success: function(){
                            MessageToast.show("Wallah! the product is now updated in sap");
                        },
                        error: function(oError){
                            //access error message from response
                            var oMessages = JSON.parse(oError.responseText);
                            MessageBox.error("Oops! there was an issue More Details : " + oMessages.error.innererror.errordetails[0].message);
                        }
                    });
                }else{
                    //Step 3: use odata to call sap to create data
                    this.oDataModel.create("/ProductSet", payload, {
                        success: function(){
                            MessageToast.show("Wallah! the product is now created in sap");
                        },
                        error: function(oError){
                            //access error message from response
                            var oMessages = JSON.parse(oError.responseText);
                            MessageBox.error("Oops! there was an issue More Details : " + oMessages.error.innererror.errordetails[0].message);
                        }
                    });
                }
                
                
            }


        });
    }
);