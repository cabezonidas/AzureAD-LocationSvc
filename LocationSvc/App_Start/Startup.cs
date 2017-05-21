using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Owin;
using Owin;

using Microsoft.Owin.Security.ActiveDirectory;
using System.Configuration;

[assembly:OwinStartup(typeof(LocationSvc.App_Start.Startup))]
namespace LocationSvc.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            ConfigureAuth(app);
        }

        private void ConfigureAuth(IAppBuilder app)
        {
            var AzureADBearerAuthOptions = new WindowsAzureActiveDirectoryBearerAuthenticationOptions
            {
                Tenant = ConfigurationManager.AppSettings["ida:Tenant"]
            };
            AzureADBearerAuthOptions.TokenValidationParameters =
                new System.IdentityModel.Tokens.TokenValidationParameters()
                {
                    // Audience is going to be the App Id URI of my service
                    ValidAudience = ConfigurationManager.AppSettings["ida:Audience"]
                };

            // I will access tokens over HTTP header
            app.UseWindowsAzureActiveDirectoryBearerAuthentication(AzureADBearerAuthOptions);
        }
    }
}