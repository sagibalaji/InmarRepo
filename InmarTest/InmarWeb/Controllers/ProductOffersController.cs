using InmarWeb.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace InmarWeb.Controllers
{
    public class ProductOffersController : ApiController
    {
        private OfferService offerService;
        public ProductOffersController(OfferService _offerService)
        {
            offerService = _offerService;
        }

        [HttpGet]
        public HttpResponseMessage GetOffers()
        {
            return Request.CreateResponse(offerService.GetTodaysOffers());
        }
    }
}
