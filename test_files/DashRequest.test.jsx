import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashRequest from 'components/DashRequest';
import { fetchFiles, approveFile, rejectFile } from 'fetch/DashRequest';
import { MemoryRouter } from 'react-router-dom';
import { Toast } from 'utils/Toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock the external modules and functions
jest.mock('fetch/DashRequest', () => ({
  fetchFiles: jest.fn(),
  approveFile: jest.fn(),
  rejectFile: jest.fn(),
}));

jest.mock('react-icons/hi', () => ({
  HiOutlineExclamationCircle: () => <div data-testid="mock-icon" />,
  HiSearch: () => <div data-testid="mock-search-icon" />,
  HiX: () => <div data-testid="mock-close-icon" />,
  HiXCircle: () => <div data-testid="mock-x-circle-icon" />,
  HiCheckCircle: () => <div data-testid="mock-check-circle-icon" />,
}));

jest.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="mock-fa-check-icon" />,
  FaTimes: () => <div data-testid="mock-fa-times-icon" />,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('DashRequest Component', () => {
  const mockData = [
    { file_name: 'test1.docx', email: 'user1@example.com' },
    { file_name: 'test2.xlsx', email: 'user2@example.com' },
  ];

  const renderWithRouter = (ui) => {
    return render(
      <MemoryRouter>
        <ToastContainer />
        {ui}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock fetchFiles to return the data directly, not wrapped in a detail property
    fetchFiles.mockResolvedValue(mockData);

    // Mock window.URL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    );

    // Mock localStorage
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders DashRequest component', async () => {
    renderWithRouter(<DashRequest />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search files')).toBeInTheDocument();
      expect(screen.getByText(/Requested files/i)).toBeInTheDocument();
    });
  });

   
    test('fetches and displays file data', async () => {
      renderWithRouter(<DashRequest />);
      await waitFor(() => {
        expect(screen.getByText('test1.docx')).toBeInTheDocument();
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('test2.xlsx')).toBeInTheDocument();
        expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      });
    });
   
    test('opens approve confirmation modal when Approve button is clicked', async () => {
      renderWithRouter(<DashRequest />);
   
      await waitFor(() => {
          const approveButtons = screen.getAllByTestId('approve-button');
          expect(approveButtons[0]).toBeInTheDocument();
          fireEvent.click(approveButtons[0]);
        });
       
        await waitFor(() => {
          expect(screen.getByText(/Are you sure you want to Approve this file?/i)).toBeInTheDocument();
        });
    });
   
    test('opens reject confirmation modal when Reject button is clicked', async () => {
      renderWithRouter(<DashRequest />);
     
      await waitFor(() => {
          const rejectButtons = screen.getAllByTestId('reject-button');
          expect(rejectButtons[0]).toBeInTheDocument();
          fireEvent.click(rejectButtons[0]);
        });
       
        await waitFor(() => {
          expect(screen.getByText(/Are you sure you want to Reject this file?/i)).toBeInTheDocument();
        });
    });

  test('approves file when confirmation is given', async () => {
    const successMessage = { message: 'File approved successfully' };
    approveFile.mockResolvedValue(successMessage);
    
    renderWithRouter(<DashRequest />);

    // Wait for the component to load and display the approve button
    await waitFor(() => {
      expect(screen.getAllByTestId('approve-button')[0]).toBeInTheDocument();
    });

    // Click the approve button
    fireEvent.click(screen.getAllByTestId('approve-button')[0]);

    // Confirm the modal is shown
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to Approve this file?/i)).toBeInTheDocument();
    });

    // Click the confirm button
    const confirmButton = screen.getByText(/Yes, Approve/i);
    fireEvent.click(confirmButton);

    // Verify approveFile was called
    await waitFor(() => {
      expect(approveFile).toHaveBeenCalled();
    });
  });

    test('filters files based on search input', async () => {
      renderWithRouter(<DashRequest />);
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search files');
        fireEvent.change(searchInput, { target: { value: 'test1' } });
        expect(screen.getByText('test1.docx')).toBeInTheDocument();
        expect(screen.queryByText('test2.xlsx')).not.toBeInTheDocument();
      });
    });
  test('rejects file when confirmation is given', async () => {
    const successMessage = { message: 'File rejected successfully' };
    rejectFile.mockResolvedValue(successMessage);
    
    renderWithRouter(<DashRequest />);

    // Wait for the component to load and display the reject button
    await waitFor(() => {
      expect(screen.getAllByTestId('reject-button')[0]).toBeInTheDocument();
    });

    // Click the reject button
    fireEvent.click(screen.getAllByTestId('reject-button')[0]);

    // Confirm the modal is shown
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to Reject this file?/i)).toBeInTheDocument();
    });

    // Click the confirm button
    const confirmButton = screen.getByText(/Yes, Reject/i);
    fireEvent.click(confirmButton);

    // Verify rejectFile was called
    await waitFor(() => {
      expect(rejectFile).toHaveBeenCalled();
    });
  });

  test('handles search functionality', async () => {
    renderWithRouter(<DashRequest />);

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('test1.docx')).toBeInTheDocument();
      expect(screen.getByText('test2.xlsx')).toBeInTheDocument();
    });

    // Get the search input and type into it
    const searchInput = screen.getByPlaceholderText('Search files');
    fireEvent.change(searchInput, { target: { value: 'test1' } });

    // Verify filtering works
    await waitFor(() => {
      expect(screen.getByText('test1.docx')).toBeInTheDocument();
      expect(screen.queryByText('test2.xlsx')).not.toBeInTheDocument();
    });
  });

  test('handles file download', async () => {
    renderWithRouter(<DashRequest />);

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('test1.docx')).toBeInTheDocument();
    });

    // Click the file name to download
    fireEvent.click(screen.getByText('test1.docx'));

    // Verify download attempt
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
   
test('handles pagination', async () => {
    renderWithRouter(<DashRequest />);

    await waitFor(() => {
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });

    expect(nextButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
    });
});
  test('handles error cases', async () => {
    // Mock fetch to fail
    fetchFiles.mockRejectedValue(new Error('Failed to fetch'));
    
    renderWithRouter(<DashRequest />);

    // Verify error message is shown
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch details')).toBeInTheDocument();
    });
  });
    test('displays error toast on fetch failure', async () => {
      fetchFiles.mockRejectedValue(new Error('Network error'));
      renderWithRouter(<DashRequest />);
   
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch details')).toBeInTheDocument();
      });
    });
   
    test('displays error toast on approve failure', async () => {
        approveFile.mockRejectedValue(new Error('Approve error'));
      
        renderWithRouter(<DashRequest />);
    
        await waitFor(() => {
          expect(screen.getAllByTestId('approve-button')[0]).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getAllByTestId('approve-button')[0]);
    
        await waitFor(() => {
          expect(screen.getByText(/Are you sure you want to Approve this file?/i)).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByText(/Yes, Approve/i));
    
        await waitFor(() => {
          expect(screen.getByText(/Error Approve the file./i)).toBeInTheDocument();
        });
      });
    
    test('displays error toast on reject failure', async () => {
        rejectFile.mockRejectedValue(new Error('Reject error'));
    
        renderWithRouter(<DashRequest />);
    
        await waitFor(() => {
          expect(screen.getAllByTestId('reject-button')[0]).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getAllByTestId('reject-button')[0]);
    
        await waitFor(() => {
          expect(screen.getByText(/Are you sure you want to Reject this file?/i)).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByText(/Yes, Reject/i));
    
        await waitFor(() => {
          expect(screen.getByText(/Error Reject the file./i)).toBeInTheDocument();
        });
      });
});