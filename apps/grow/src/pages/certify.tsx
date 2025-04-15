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
import { Certificate, DomainModel, User } from '../lib/type-utils';

export default function CertifyPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [domainModel, setDomainModel] = useState<DomainModel | null>(null);
  const [certifications, setCertifications] = useState<Certificate[]>([]);

  const { user } = useAuth();

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-pink-100 p-6">
      <>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-xl p-6 border">
              <h1 className="text-xl font-bold mb-4 text-gray-800">
                Select a User
              </h1>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Certifications
              </h2>
              <div className="overflow-y-auto max-h-72 pr-2 space-y-3">
                {domainModel &&
                  domainModel.nodes?.map((node) => {
                    const certified = isCertified(node.id);
                    return (
                      <div
                        key={node.id}
                        className={`flex justify-between items-center border rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition ${
                          certified
                            ? 'bg-green-100 border-green-300'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            certified ? 'text-green-800' : 'text-blue-800'
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
                          className={`px-4 py-1.5 rounded transition ${
                            certified
                              ? 'bg-gray-200 hover:bg-gray-300 text-blue-900'
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
        </div>
        <div className="bg-white border rounded-3xl shadow-lg p-6 overflow-x-auto w-full max-w-screen-xl mx-auto mt-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-blue-800 cursor-pointer text-3xl font-bold">
              {selectedUserId
                ? (() => {
                    const selected = allUsers.find(
                      (u) => u.id === selectedUserId
                    );
                    return selected ? (
                      <>
                        {selected.name || 'Unnamed'}
                        {'’s'}
                        <span className="text-pink-400  font-medium">
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
            {/* TODO later  */}
            <button className="bg-gray-200 text-sm px-4 py-1.5 rounded hover:bg-gray-300">
              Filter Nodes
            </button>
          </div>
          <div className="min-w-[1200px] px-4 py-4">
            <DomainModelViewer
              universalDomainModelData={domainModel}
              certifications={certifications}
            />
          </div>
        </div>
      </>
    </div>
  );
}
