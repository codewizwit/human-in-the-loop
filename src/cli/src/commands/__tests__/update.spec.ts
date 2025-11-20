import { updateCommand } from '../update';
import { execSync } from 'child_process';

jest.mock('child_process');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

// Note: We don't mock package.json because the require path in update.ts
// resolves to the actual built package.json (version 1.1.7)

describe('update command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it('should show success message when already on latest version', async () => {
    // Mock npm view to return same version as current (1.1.7)
    mockExecSync.mockReturnValueOnce('1.1.7' as never); // npm view call

    await updateCommand();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('already running the latest version')
    );
  });

  it('should update CLI when newer version is available', async () => {
    // First call: npm view (get latest version)
    mockExecSync.mockReturnValueOnce('1.2.0\n' as never);

    // Second call: npm install (perform update)
    mockExecSync.mockReturnValueOnce('' as never);

    await updateCommand();

    expect(mockExecSync).toHaveBeenCalledWith(
      'npm view @human-in-the-loop/cli version',
      expect.any(Object)
    );
    expect(mockExecSync).toHaveBeenCalledWith(
      'npm install -g @human-in-the-loop/cli@latest',
      expect.any(Object)
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Successfully updated')
    );
  });

  it('should handle error when unable to check for updates', async () => {
    // Mock npm view to throw error
    mockExecSync.mockImplementationOnce(() => {
      throw new Error('Network error');
    });

    await updateCommand();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Unable to check for updates')
    );
  });

  it('should handle error when update fails', async () => {
    // First call succeeds (get latest version)
    mockExecSync.mockReturnValueOnce('1.2.0\n' as never);

    // Second call fails (update fails)
    mockExecSync.mockImplementationOnce(() => {
      throw new Error('Update failed');
    });

    await updateCommand();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Update failed')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('try manually')
    );
  });
});
