using SimpleInjector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Dependencies;
using System.Web.Mvc;

namespace InmarWeb.services
{
    public class SimpleInjectorDependencyResolver : System.Web.Mvc.IDependencyResolver,
        System.Web.Http.Dependencies.IDependencyResolver,
        System.Web.Http.Dependencies.IDependencyScope
    {
        public SimpleInjectorDependencyResolver(Container container)
        {
            if (container == null)
            {
                throw new ArgumentNullException("Container");
            }
            this.Container = container;
        }

        public Container Container { get; private set; }

        public object GetService(Type serviceType)
        {
            if (!serviceType.IsAbstract && typeof(IController).IsAssignableFrom(serviceType))
                return this.Container.GetInstance(serviceType);

            return ((IServiceProvider)this.Container).GetService(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return this.Container.GetAllInstances(serviceType);
        }

        public IDependencyScope BeginScope()
        {
            return this;
        }

        object IDependencyScope.GetService(Type serviceType)
        {
            return ((IServiceProvider)this.Container).GetService(serviceType);
        }

        IEnumerable<object> IDependencyScope.GetServices(Type serviceType)
        {
            IServiceProvider provider = Container;
            Type CollectionType = typeof(IEnumerable<>).MakeGenericType(serviceType);
            var services = (IEnumerable<object>)provider.GetService(CollectionType);
            return services ?? Enumerable.Empty<object>();
        }

        public void Dispose()
        {
            
        }

        
    }
}