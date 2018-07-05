import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { AuthModalsPage } from '../../pages/pages';

@Injectable()
export class ModelinfoProvider {

	public errorMsgs: any = {};

	public modelPopConfig: any = {};
	constructor(public http: Http, public modalCtrl: ModalController, ) {
		
		this.errorMsgs = {
			invalidLogin: "Invalid login or password.",
			registerSuccess: "Congratulations! You have succesfully created your account with the email ",
			registerError: "This email ID is already registered with us",
			forgotSuccess: "Email sent for reset password"
		};

		this.modelPopConfig = {
			icons: [
				"assets/icon/11-Model-info/tick.png",
				"assets/icon/11-Model-info/cross.svg"
			],
			header: ["Congratulations!"],
			description: [{
				text: "You have successfully created your Jaypore account with the email address",
				color: "#212121",
			}, {
				text: "This email address is already registered, you may",
				color: "#212121",
			}, {
				text: "Wrong username or password",
				color: "#212121",
			}, {
				text: "Reset password link has been sent to",
				color: "#212121",
			}],
			actionBtn: [
				{
					text: "CONTINUE SHOPPING",
					action: "home"
				}, {
					text: "LOGIN",
					action: "login"
				}
				, {
					text: "FORGOT PASSWORD",
					action: "forgot"
				}
			],
			btnText: ["with the same email address"],
			bottomButton: [
				{
					text: "RESET PASSWORD",
					action: "forgot"
				}, {
					text: "Action Button",
					action: "login"
				}],

		}
	}

	getLogin(msg) {
		this.modelPopConfig = {
			login: {
				Loginsuccess: {
					1: {
						type: "icon",
						value: "URL",
					},
					2: {
						type: "header",
						value: "value"
					},
					3: {
						type: "PrimaryText",
						value: "value"
					},
					4: {
						type: "Primary Button",
						value: "Retry",
						ResponsePgae: "Pageinfo"
					},
					5: {
						type: "SecondaryText",
						value: "value"
					},
					6: {
						type: "Secondary Button",
						value: "value",
						ResponsePgae: "Pageinfo"
					}

				},
				Invalidlogin: {
					1: {
						type: "icon",
						value: "assets/icon/11-Model-info/tick.png",
					},
					2: {
						type: "header",
						value: "Login Fail"
					},
					3: {
						type: "PrimaryText",
						value: "Invalid login or password."
					},
					4: {
						type: "Primary Button",
						value: "Retry",
						ResponsePgae: "login"
					},
					5: {
						type: "SecondaryText",
						value: null
					},
					6: {
						type: "Secondary Button",
						value: null,
						ResponsePgae: null
					},
					7: {
						type: "isORinfo",
						value: false,
					}

				}
			}
		};

		return this.modelPopConfig;
	}
	getSingup() {
		this.modelPopConfig = '';
		this.modelPopConfig = {
			Singup: {
				Singusuccess: {
					1: {
						type: "icon",
						value: "URL",
					},
					2: {
						type: "header",
						value: "value"
					},
					3: {
						type: "PrimaryText",
						value: "value"
					},
					4: {
						type: "Primary Button",
						value: "value",
						ResponsePgae: "Pageinfo"
					},
					5: {
						type: "SecondaryText",
						value: "value"
					},
					6: {
						type: "Secondary Button",
						value: "value",
						ResponsePgae: "Pageinfo"
					},
					7: {
						type: "isORinfo",
						value: false,
					}

				}
			}
		};

		return this.modelPopConfig;
	}
	addToBag() {
		this.modelPopConfig = '';
		this.modelPopConfig = {
			addToBag: {
				addToBagSuccess: {
					1: {
						type: "icon",
						value: "assets/icon/11-Model-info/tick.png",
					},
					2: {
						type: "header",
						value: "success"
					},
					3: {
						type: "PrimaryText",
						value: "value"
					},
					4: {
						type: "Primary Button",
						value: "continue shopping",
						ResponsePgae: "pdp"
					},
					5: {
						type: "SecondaryText",
						value: "value"
					},
					6: {
						type: "Secondary Button",
						value: "value",
						ResponsePgae: "Pageinfo"
					},
					7: {
						type: "isORinfo",
						value: false,
					}

				},
				addToBagError: {
					1: {
						type: "icon",
						value: "assets/icon/11-Model-info/tick.png",
					},
					2: {
						type: "header",
						value: "Add To bag Fail"
					},
					3: {
						type: "PrimaryText",
						value: "Record not found."
					},
					4: {
						type: "Primary Button",
						value: "Retry",
						ResponsePgae: "Pdp"
					},
					5: {
						type: "SecondaryText",
						value: null
					},
					6: {
						type: "Secondary Button",
						value: null,
						ResponsePgae: null
					},
					7: {
						type: "isORinfo",
						value: false,
					}

				},
				addToBagCommon: {
					1: {
						type: "icon",
						value: "assets/icon/11-Model-info/tick.png",
					},
					2: {
						type: "header",
						value: "Add To bag Fail"
					},
					3: {
						type: "PrimaryText",
						value: "Requested quantity is not available in stock."
					},
					4: {
						type: "Primary Button",
						value: "Retry",
						ResponsePgae: "Pdp"
					},
					5: {
						type: "SecondaryText",
						value: null
					},
					6: {
						type: "Secondary Button",
						value: null,
						ResponsePgae: null
					},
					7: {
						type: "isORinfo",
						value: false,
					}

				}

			}
		};

		return this.modelPopConfig;
	}
	internetIssue(pageinfo) {
		this.modelPopConfig = '';
		this.modelPopConfig = {
			internet: {
				interneterror: {
					1: {
						type: "icon",
						value: "assets/icon/11-Model-info/tick.png",
					},
					2: {
						type: "header",
						value: "Error"
					},
					3: {
						type: "PrimaryText",
						value: "please check your internet connection."
					},
					4: {
						type: "Primary Button",
						value: "ok",
						ResponsePgae: pageinfo
					},
					5: {
						type: "SecondaryText",
						value: null
					},
					6: {
						type: "Secondary Button",
						value: null,
						ResponsePgae: null
					},
					7: {
						type: "isORinfo",
						value: false,
					}

				}
			}
		};

		return this.modelPopConfig;
	}
	showmodel(data, moduleinfo, actioninfo) {
		this.presentModal(data[moduleinfo][actioninfo]['1']['value'],
			data[moduleinfo][actioninfo]['2']['value'],
			data[moduleinfo][actioninfo]['3']['value'],
			data[moduleinfo][actioninfo]['4']['value'],
			data[moduleinfo][actioninfo]['4']['ResponsePgae'],
			data[moduleinfo][actioninfo]['6']['value'],
			data[moduleinfo][actioninfo]['6']['ResponsePgae'],
			data[moduleinfo][actioninfo]['7']['value'],
		);
	}

	presentModal(iconUrl = null, headerinfo = null, Ptext = null, Pbutton = null, PbuuttonAction = null, Sbutton = null, SbuuttonAction = null, isORinfo = false) {
		var options = {
			showBackdrop: true,
			enableBackdropDismiss: false,
			cssClass: "auth-modal"
		};

		var data = {
			icon: iconUrl,
			header: headerinfo,
			description: {
				text: Ptext,
				color: "#212121",
			},
			actionBtn: {
				text: Pbutton,
				action: PbuuttonAction
			},
			btnText: null,
			isOR: isORinfo,
			bottomButton: {
				text: Sbutton,
				action: SbuuttonAction
			}
		};

		let modal = this.modalCtrl.create(AuthModalsPage, { data: data }, options);
		modal.present();
	}

	getModalData(msg) {
		
		let data = {};
		if (msg == this.errorMsgs.invalidLogin) {
			data = {
				icon: this.modelPopConfig.icons[1],
				header: false,
				description: this.modelPopConfig.description[2],
				actionBtn: this.modelPopConfig.actionBtn[2],
				btnText: false,
				isOR: false,
				bottomButton: false,
				enableBackdropDismiss: true

			};
		} else if (msg == this.errorMsgs.registerError) {
			data = {
				icon: false,
				header: false,
				description: this.modelPopConfig.description[1],
				actionBtn: this.modelPopConfig.actionBtn[1],
				btnText: this.modelPopConfig.btnText[0],
				isOR: true,
				bottomButton: this.modelPopConfig.bottomButton[0],
				enableBackdropDismiss: true
			};
		}
		else if (msg == this.errorMsgs.registerSuccess) {
		
			data = {
				icon: this.modelPopConfig.icons[0],
				header: this.modelPopConfig.header[0],
				description: this.modelPopConfig.description[0],
				actionBtn: this.modelPopConfig.actionBtn[0],
				btnText: false,
				isOR: false,
				bottomButton: false,
				enableBackdropDismiss: false
			};
		}
		else if (msg == this.errorMsgs.forgotSuccess) {
			data = {
				icon: this.modelPopConfig.icons[0],
				header: false,
				description: this.modelPopConfig.description[3],
				actionBtn: this.modelPopConfig.actionBtn[3],
				btnText: false,
				isOR: false,
				bottomButton: false,
				enableBackdropDismiss: true
			};
		}
		return data;
	}

	showModal(msg, email) {
		let modalData: any;
		modalData = this.getModalData(msg);
		modalData.email = email;
		var options = {
			showBackdrop: true,
			enableBackdropDismiss: modalData.enableBackdropDismiss,
			cssClass: "action-modal"
		};
		let modal = this.modalCtrl.create(AuthModalsPage, { data: modalData }, options);
		modal.present();
	}

}
