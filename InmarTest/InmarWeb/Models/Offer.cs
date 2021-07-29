using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InmarWeb.Models
{
    public class Offer
    {
        public Offer(string offerName, List<Product> products)
        {
            OfferName = OfferName;
            Products = products;
        }
        public string OfferName { get; set; }
        public List<Product> Products { get; set; }
    }
}