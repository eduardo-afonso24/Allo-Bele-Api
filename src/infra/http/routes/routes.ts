// // import {
// //   AdminRegister,
// //   Adminlogin,
// //   BaberAndCompanyEmailConfirmation,
// //   BaberRegisterByAdmin,
// //   SendConfirmationNotification,
// //   createAdminPubs,
// //   getAllRequests,
// //   getPubs,
// //   getconfirmedRequets,
// // } from "../controllers/Admin";
// // import multer from "multer";


// // import {
// //   registerClient,
// //   registerBarber,
// //   registerCompany,
// //   loginToAll,
// //   printClientList,
// //   printBarberList,
// //   printCompanyList,
// //   editClientData,
// //   editBarberData,
// //   editCompanyData,
// //   ChangeStatus,
// //   getUsersWithStatusTrue,
// //   SendRequestToAdmin,
// //   printConfirmationRequets,
// //   updateUserLocation,
// //   getUserLocation,
// //   getClientName,
// //   checkAndDeleteSchedules,
// //   getAllSchedules,
// //   getProfissionalServices,
// //   getUnreadConfirmationMessages,
// //   markConfirmationMessageAsRead,
// //   addService,
// //   deleteService,
// //   editService,
// //   saveAppointment,
// //   saveAppointmentInClient,
// //   getAppointmentsByBaberId,
// //   respondToAppointment,
// //   editUserProfile
// // } from "../controllers/user";
// import { Router } from "express";
// const router = Router();

// // router.post('/sendRequestToAdmin', SendRequestToAdmin);
// // router.post('/AdminPubs', createAdminPubs )
// // router.get('/getPubs', getPubs )
// // router.get('/getConfirmedRequests', getconfirmedRequets)
// // router.post('/SendBookMarkTobarber', saveAppointment)
// // router.delete('/checkAndDeleteSchedules', checkAndDeleteSchedules)
// // router.get('/get', getAllSchedules)
// // router.get('/getProfissionalsServices/:id', getProfissionalServices)
// // router.get('/unreadM/:id', getUnreadConfirmationMessages)
// // router.put('/markAsRead/:userId/:messageId', markConfirmationMessageAsRead);
// // router.post('/sendbookMark/:userId', saveAppointment)
// // router.post('/saveAppointInClient', saveAppointmentInClient)
// // router.get('/getBaberSchedules/:BaberId', getAppointmentsByBaberId )
// // router.post('/respondToApointment', respondToAppointment)
// //router.post("/AddMessagesToAll", addMessageToAllUsers)
// //Rotas do administrador
// // router.post("/Adminregister", AdminRegister);
// // router.post("/Adminlogin", Adminlogin);
// // router.post("/AdminBaberRegister", registerBarber);
// // router.post("/AdminBabercompany", isAuthenticatedAdim, registerCompany);
// // router.post("/getAllRequests", getAllRequests);
// // router.post("/sendConfir", SendConfirmationNotification);
// // router.post("/AddServices", addService);
// // router.delete('/Deleteservice', deleteService)
// // router.put('/edit-service/:userId/:serviceId', editService);
// // router.put('/editUserprofile/:userId', editUserProfile)
// //router.post("/BCEmailconfirmation", BaberAndCompanyEmailConfirmation)

// //ROTAS DE BARBEIROS; USER NORMAIS; EMPRESAS

// router.post("/client-register", registerClient);
// // router.post("/CBClogin", loginToAll);
// // router.get("/getAllclient", printClientList);
// // router.get("/getAllbarber", printBarberList);
// // router.get("/getAllcompany", printCompanyList);
// // router.post("/BCEmailconfirmation",BaberAndCompanyEmailConfirmation)
// // router.put("/EditClient/:clientId", editClientData);
// // router.put("/EditBaber/:barberId", editBarberData);
// // router.put("/EditCompany/:companyId", editCompanyData);
// // router.put("/SwitchStatus/:id", ChangeStatus);
// // router.get("/AvailebleBabers", getUsersWithStatusTrue);
// // router.get("/ListAllRequests/:id", printConfirmationRequets);
// // router.post("/location", updateUserLocation);
// // router.get("/location/:userId", getUserLocation);
// // router.get('/clientName/:id', getClientName)
// export default router;