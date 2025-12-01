import { updateCommand } from '../update';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<
  typeof readFileSync
>;

describe('update command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    mockReadFileSync.mockReturnValue(JSON.stringify({ version: '2.0.0' }));
  });

  it('should show success message when already on latest version', async () => {
    // Mock npm view to return same version as current (2.0.0)
    mockExecSync.mockReturnValueOnce('2.0.0' as never); // npm view call

    await updateCommand();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('already running the latest version')
    );
  });

  it('should update CLI when newer version is available', async () => {
    // First call: npm view (get latest version)
    mockExecSync.mockReturnValueOnce('2.1.0\n' as never);

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
    mockExecSync.mockReturnValueOnce('2.1.0\n' as never);

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

  it('should handle unknown current version when package.json cannot be read', async () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });
    mockExecSync.mockReturnValueOnce('2.1.0' as never);
    mockExecSync.mockReturnValueOnce('' as never);

    await updateCommand();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Current version: vunknown')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Successfully updated')
    );
  });
});
