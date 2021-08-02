using InmarWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InmarWeb.services
{
    public interface IOfferService
    {
        List<Product> GetAllProducts();
        List<Offer> GetTodaysOffers();
    }
}
