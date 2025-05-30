import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PrivateRouter = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        const baseUrl = `${window.location.origin}/auth/signin`;
        router.replace(baseUrl);
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default PrivateRouter;
