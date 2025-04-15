import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/context';
import { getAllUsers, getDomainModel } from '../utils/apis';
import DomainModelViewer from '../components/domainModelViewer';
import { Certificate, DomainModel, User } from '../lib/type-utils';

export default function CertifyPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [domainModels, setDomainModels] = useState<DomainModel | null>(null);
  const [certifications, setCertifications] = useState<Certificate[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allUsers, domainModelsRes] = await Promise.all([
          getAllUsers(),
          getDomainModel(),
        ]);
        setDomainModels(domainModelsRes);
        //here currentUser can be obtained by creating separate function getUserInfo or
        // something like that which gives detail of current logged in user from
        // postgresDb and not firebase ,instead of this approach
        const matchedUser = allUsers.find((u: User) => u.email === user?.email);
        if (matchedUser) {
          setCurrentUser(matchedUser);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user?.email) fetchData();
  }, [user]);
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const { data } = await axios.get(
          `/api/certifications/${currentUser?.id}`
        );
        setCertifications(data.certifications || []);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      }
    };

    if (currentUser?.id) fetchCertifications();
  }, [currentUser]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-pink-100 p-6">
      <div className="bg-white border rounded-3xl shadow-lg p-6 overflow-x-auto w-full max-w-screen-xl mx-auto mt-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 drop-shadow">
            Track Your Certifications
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Explore the abilities you’ve been certified in.{' '}
          </p>
        </div>
        <div className="min-w-[1200px] px-4 py-4">
          <DomainModelViewer
            universalDomainModelData={{
              nodes: domainModels?.nodes || [],
              edges: domainModels?.edges || [],
            }}
            certifications={certifications}
          />
        </div>
      </div>
    </div>
  );
}
