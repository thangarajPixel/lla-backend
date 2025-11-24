import { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Typography,
  IconButton,
  Box,
  Button,
} from '@strapi/design-system';
import { Eye, Check } from '@strapi/icons';
import { Page, Layouts, useFetchClient } from '@strapi/strapi/admin';

export const App = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { get } = useFetchClient();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await get('/api/admissions', {
        params: {
          populate: '*',
          pagination: {
            page: 1,
            pageSize: 100,
          },
        },
      });
      console.log('API Response:', response);
      setAdmissions(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (admission: any) => {
    const baseUrl = process.env.ADMISSION_VIEW_URL || 'http://localhost:3000/admission-view';
    const externalUrl = `${baseUrl}?id=${admission.documentId || admission.id}`;
    window.open(externalUrl, '_blank');
  };

  const handleAction = (admission: any) => {
    const admissionData = admission.attributes || admission;
    setSelectedAdmission({ ...admissionData, id: admission.id });
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    console.log('Action confirmed for:', selectedAdmission);
    setIsModalOpen(false);
    setSelectedAdmission(null);
  };

  if (loading) {
    return (
      <Page.Main>
        <Layouts.Header title="Admissions" />
        <Box padding={8}>
          <Typography>Loading...</Typography>
        </Box>
      </Page.Main>
    );
  }

  return (
    <Page.Main>
      <Layouts.Header title="Admissions" subtitle={`${admissions.length} entries found`} />

      <Box padding={8}>
        <Table colCount={8} rowCount={admissions.length + 1}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  ID
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  First Name
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Last Name
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Email
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Mobile
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Status
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  View
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Action
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {admissions.map((admission) => (
              <Tr key={admission.id}>
                <Td>
                  <Typography>{admission.id}</Typography>
                </Td>
                <Td>
                  <Typography>{admission.first_name || admission.attributes?.first_name}</Typography>
                </Td>
                <Td>
                  <Typography>{admission.last_name || admission.attributes?.last_name}</Typography>
                </Td>
                <Td>
                  <Typography>{admission.email || admission.attributes?.email}</Typography>
                </Td>
                <Td>
                  <Typography>{admission.mobile_no || admission.attributes?.mobile_no}</Typography>
                </Td>
                <Td>
                  <Typography>
                    {admission.publishedAt || admission.attributes?.publishedAt ? 'Published' : 'Draft'}
                  </Typography>
                </Td>
                <Td>
                  <IconButton
                    onClick={() => handleView(admission)}
                    label="View"
                  >
                    <Eye style={{ color: '#4945ff' }} />
                  </IconButton>
                </Td>
                <Td>
                  <IconButton
                    onClick={() => handleAction(admission)}
                    label="Action"
                  >
                    <Check style={{ color: '#5cb176' }} />
                  </IconButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {isModalOpen && selectedAdmission && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight="bold" variant="beta" style={{ marginBottom: '16px' }}>
              Confirm Action
            </Typography>
            <Typography style={{ marginBottom: '16px' }}>
              Are you sure you want to perform this action for admission ID: {selectedAdmission.id}?
            </Typography>

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f6f6f9', borderRadius: '4px' }}>
              <Typography fontWeight="bold" style={{ marginBottom: '8px' }}>
                Applicant Details:
              </Typography>
              <Typography>Name: {selectedAdmission.first_name} {selectedAdmission.last_name}</Typography>
              <Typography>Email: {selectedAdmission.email}</Typography>
              <Typography>Mobile: {selectedAdmission.mobile_no}</Typography>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <Button onClick={() => setIsModalOpen(false)} variant="tertiary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} variant="success">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page.Main>
  );
};
