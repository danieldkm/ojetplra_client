/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
// app configuration for public release

define([], function () {
  return {
    appId: 'com.unifil.exir',
    appVersion: '1.0',
    // ReadOnly MBE
    backendName: 'fixitfastclient',
    backendUrl: 'teste.backendUrl',
    passWord: 'OT4RM9PXlTbyt9pdmi3MLyjkLkAu4+YeAc+QCLcvxU1+YC4P4l7en11Wtz3mWArXJmLedMKJ10wzY26/cuouOjcNhW392537PN0LSqvUAm44pja0aRyO2LVFFRrxixYG5IQe0gU0DuGZwg8Mn0u5uaAxr3X0fwSA+YefyzijBF0=',
    userName: 'daniel',
    backendHeaders: {
      // 'Oracle-Mobile-Backend-Id': '8b1481b1-0e80-4a24-8d74-b05af753cfe1',
      // 'Authorization': 'Basic TUNTSUREMV9NQ1NTVkMxREVWX01PQklMRV9BTk9OWU1PVVNfQVBQSUQ6VjNqeWMuNWtxcHRzbWY='
      // 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGFkcmlhbm8iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTI4MTIxMzkzLCJleHAiOjEuNDQwMDAwMDAwMDAwMDE1M2UrMjN9.EOa8BqXc1uGIEE42VH1XpBhD4ZxtYJllNDsiaY4Q5XA'
    },
    registrationUrl: 'https://plra.unifil.br:8080/api/signin',
    senderID: 'XXXXXXX' // Where the XXXXXXX maps to the project number in the Google Developer Console.
  }
})
