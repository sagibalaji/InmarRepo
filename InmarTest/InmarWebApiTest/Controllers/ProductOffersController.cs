using InmarWeb.Models;
using InmarWeb.services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InmarWebApiTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductOffersController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ProductOffersController> _logger;

        private IOfferService offerService;

        public ProductOffersController(ILogger<ProductOffersController> logger, IOfferService service)
        {
            _logger = logger;
            offerService = service;
        }

        [HttpGet("GetOffers")]
        public List<Offer> GetOffers()
        {
            return offerService.GetTodaysOffers();
        }
    }
}
