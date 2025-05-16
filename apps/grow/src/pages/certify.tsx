import { useEffect, useState } from 'react';
import { useAuth } from '../components/context';
import DomainModelViewer from '../components/domainModelViewer';
import {
  certify,
  getAllUsers,
  getCertifications,
  getDomainModel,
  unCertify,
} from '../utils/apis';
import { Certificate, User } from '../lib/type-utils';
import { useRouter } from 'next/navigation';

export default function CertifyPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [domainModel, setDomainModel] = useState<any>(null);
  const [certifications, setCertifications] = useState<Certificate[]>([]);
  const router = useRouter();
  const { user, isUserAdmin, loading} = useAuth();
  if(!isUserAdmin  && !loading){
    router.push('/');
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allUsers, domainModels] = await Promise.all([
          getAllUsers(),
          getDomainModel(),
        ]);
        setAllUsers(allUsers);
        setDomainModel(domainModels);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const { certifications } = await getCertifications(selectedUserId);
        setCertifications(certifications || []);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      }
    };
    if (selectedUserId) fetchCertifications();
  }, [selectedUserId]);

  const isCertified = (abilityId: string) =>
    certifications.some(
      (c) => c.abilityId === abilityId && c.learnerId === selectedUserId
    );

  const handleCertify = async (abilityId: string) => {
    if (!selectedUserId) return alert('Please select a user first.');
    const certifierId = allUsers.find((u) => u.email === user?.email)?.id;
    //here as well no need to pass certifierId we can get from cookie in backend only
    if (!certifierId) return;
    const data = await certify(abilityId, selectedUserId, certifierId);
    if (data.success) {
      setCertifications((prev) => [...prev, data.certification]);
    }
  };

  const handleUncertify = async (abilityId: string) => {
    if (!selectedUserId) return alert('Please select a user first.');
    const certifierId = allUsers.find((u) => u.email === user?.email)?.id;
    //here as well no need to pass certifierId we can get from cookie in backend only
    if (!certifierId) return;
    const data = await unCertify(abilityId, selectedUserId, certifierId);
    if (data.success) {
      setCertifications((prev) =>
        prev.filter((c) => c.id !== data.certification.id)
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
  <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* User Selection Panel */}
      <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-md p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">
          Select a User
        </h1>
        <select
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="" disabled>
            -- Select User --
          </option>
          {allUsers
            .filter((u) => u.email !== user?.email)
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || 'Unnamed'} ({user.email})
              </option>
            ))}
        </select>
      </div>

      {/* Certification Panel */}
      <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Certifications
        </h2>
        <div className="overflow-y-auto max-h-72 pr-2 space-y-2">
          {domainModel?.nodes?.map((node: any) => {
            const certified = isCertified(node.id);
            return (
              <div
                key={node.id}
                className={`flex justify-between items-center border px-3 py-2 rounded-md ${
                  certified
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    certified ? 'text-green-700' : 'text-gray-800'
                  }`}
                >
                  {node.data.label}
                </span>
                <button
                  onClick={() =>
                    certified
                      ? handleUncertify(node.id)
                      : handleCertify(node.id)
                  }
                  className={`text-sm px-3 py-1 rounded-md transition ${
                    certified
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {certified ? 'Uncertify' : 'Certify'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Domain Model Viewer */}
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          {selectedUserId
            ? (() => {
                const selected = allUsers.find(
                  (u) => u.id === selectedUserId
                );
                return selected ? (
                  <>
                    {selected.name || 'Unnamed'}
                    {'’s '}
                    <span className="text-gray-500 text-base font-normal">
                      ({selected.email})
                    </span>
                    {' Domain Model'}
                  </>
                ) : (
                  'Domain Model Viewer'
                );
              })()
            : 'Domain Model Viewer'}
        </h1>
      </div>
      <div className="overflow-hidden  min-w-[80%]">
        <DomainModelViewer
          universalDomainModelData={domainModel}
          certifications={certifications}
        />
      </div>
    </div>
  </div>
</div>

  );
}
