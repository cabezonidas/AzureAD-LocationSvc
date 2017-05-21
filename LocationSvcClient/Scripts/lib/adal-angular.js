﻿/*! adal-angular v1.0.0 2015-02-18 */
"use strict"; if ("undefined" != typeof module && module.exports) { var window, localStorage, angular, document, AuthenticationContext; module.exports.inject = function (a, b, c, d, e, f) { window = a, localStorage = b, document = c, Math = d, angular = e, AuthenticationContext = f } } !function () { if (angular) { var a = angular.module("AdalAngular", []); a.provider("adalAuthenticationService", function () { var a = null, b = { isAuthenticated: !1, userName: "", loginError: "", profile: "" }, c = function (c) { var d = a.getCachedToken(c); b.isAuthenticated = null !== d && d.length > 0; var e = a.getCachedUser() || { userName: "" }; b.userName = e.userName, b.profile = e.profile, b.loginError = a.getLoginError() }; this.init = function (b, d) { if (!b) throw new Error("You must set configOptions, when calling init"); var e = window.location.hash, f = window.location.href; e && (f = f.replace(e, "")), b.redirectUri = b.redirectUri || f, b.postLogoutRedirectUri = b.postLogoutRedirectUri || f, d && d.interceptors && d.interceptors.push("ProtectedResourceInterceptor"), a = new AuthenticationContext(b), c(a.config.loginResource) }, this.$get = ["$rootScope", "$window", "$q", "$location", "$timeout", function (d, e, f, g, h) { var i = function () { var f = e.location.hash; if (a.isCallback(f)) { var i = a.getRequestInfo(f); if (a.saveTokenFromHash(i), e.location.hash = "", i.requestType !== a.REQUEST_TYPE.LOGIN && (a.callback = e.parent.AuthenticationContext().callback), i.stateMatch) if ("function" == typeof a.callback) { if (i.requestType === a.REQUEST_TYPE.RENEW_TOKEN) { if (i.parameters.access_token) return void a.callback(a._getItem(a.CONSTANTS.STORAGE.ERROR_DESCRIPTION), i.parameters.access_token); if (i.parameters.id_token) return void a.callback(a._getItem(a.CONSTANTS.STORAGE.ERROR_DESCRIPTION), i.parameters.id_token) } } else c(a.config.loginResource), b.userName ? (h(function () { c(a.config.loginResource), d.userInfo = b; var e = a._getItem(a.CONSTANTS.STORAGE.START_PAGE); e && g.path(e) }, 1), d.$broadcast("adal:loginSuccess")) : d.$broadcast("adal:loginFailure", a._getItem(a.CONSTANTS.STORAGE.ERROR_DESCRIPTION)) } else c(a.config.loginResource), a._renewActive || b.isAuthenticated || !b.userName || a._getItem(a.CONSTANTS.STORAGE.FAILED_RENEW) || a.acquireToken(a.config.loginResource, function (a, c) { a ? d.$broadcast("adal:loginFailure", "auto renew failure") : c && (b.isAuthenticated = !0) }); h(function () { c(a.config.loginResource), d.userInfo = b }, 1) }, j = function (c, e) { e && e.$$route && e.$$route.requireADLogin && (b.isAuthenticated || (console.log("Route change event for:" + g.$$path), a.config && a.config.localLoginUrl ? g.path(a.config.localLoginUrl) : (a._saveItem(a.CONSTANTS.STORAGE.START_PAGE, g.$$path), console.log("Start login at:" + window.location.href), d.$broadcast("adal:loginRedirect"), a.login()))) }, k = function (c, e) { e && e.requireADLogin && (b.isAuthenticated || (console.log("Route change event for:" + e.url), a.config && a.config.localLoginUrl ? g.path(a.config.localLoginUrl) : (a._saveItem(a.CONSTANTS.STORAGE.START_PAGE, e.url), console.log("Start login at:" + window.location.href), d.$broadcast("adal:loginRedirect"), a.login()))) }; return d.$on("$routeChangeStart", j), d.$on("$stateChangeStart", k), d.$on("$locationChangeStart", i), c(a.config.loginResource), d.userInfo = b, { config: a.config, login: function () { a.login() }, loginInProgress: function () { return a.loginInProgress() }, logOut: function () { a.logOut() }, getCachedToken: function (b) { return a.getCachedToken(b) }, userInfo: b, acquireToken: function (b) { var c = f.defer(); return a.acquireToken(b, function (b, d) { b ? (a._logstatus("err :" + b), c.reject(b)) : c.resolve(d) }), c.promise }, getUser: function () { var b = f.defer(); return a.getUser(function (c, d) { c ? (a._logstatus("err :" + c), b.reject(c)) : b.resolve(d) }), b.promise }, getResourceForEndpoint: function (b) { return a.getResourceForEndpoint(b) }, clearCache: function () { a.clearCache() }, clearCacheForResource: function (b) { a.clearCacheForResource(b) } } }] }), a.factory("ProtectedResourceInterceptor", ["adalAuthenticationService", "$q", "$rootScope", function (a, b, c) { return { request: function (c) { if (c) { c.headers = c.headers || {}; var d = a.getResourceForEndpoint(c.url), e = a.getCachedToken(d), f = !1; if (e) return c.headers.Authorization = "Bearer " + e, c; if (a.config) for (var g in a.config.endpoints) c.url.indexOf(g) > -1 && (f = !0); if (a.loginInProgress()) return b.reject(); if (a.config && f) { var h = b.defer(); return a.acquireToken(d).then(function (a) { c.headers.Authorization = "Bearer " + a, h.resolve(c) }, function (a) { h.reject(a) }), h.promise } return c } }, responseError: function (d) { if (d && 401 === d.status) { var e = a.getResourceForEndpoint(d.config.url); a.clearCacheForResource(e), c.$broadcast("adal:notAuthorized", d, e) } return b.reject(d) } } }]) } else console.log("Angular.JS is not included") }();