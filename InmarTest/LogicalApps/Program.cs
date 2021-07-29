using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicalApps
{
    class Program
    {
        static void Main(string[] args)
        {
            Program p = new Program();
            p.divisablebynumber();

            System.Console.WriteLine("Enter Text to print in reverse:");
            string text = System.Console.ReadLine();
            System.Console.WriteLine($"reverse text: {p.reverse(text)}");

            System.Console.ReadLine();
        }

        public void divisablebynumber()
        {
            for (int i = 0; i < 100; i++)
            {
                string printText = "";
                if (i % 3 == 0 && i % 5 == 0)
                {
                    printText = "fizzbuzz";
                }
                else if (i % 3 == 0)
                {
                    printText = "Fizz";
                }
                else if (i % 5 == 0)
                {
                    printText = "buzz";
                }

                if (!String.IsNullOrEmpty(printText))
                    System.Console.WriteLine(printText);
            }
            System.Console.WriteLine();
        }

        public string reverse(string text)
        {
            StringBuilder reverseText = new StringBuilder();
            text.Reverse().ToList().ForEach(x => reverseText.Append(x));
            return reverseText.ToString();
        }
    }
}
