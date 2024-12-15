import os

def rename_files(directory):
    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist.")
        return
    
    for filename in os.listdir(directory):
        if filename.endswith('.jsx'):
            old_file = os.path.join(directory, filename)
            new_file = os.path.join(directory, filename.replace('.jsx', '.tsx'))
            print(f'Attempting to rename: {old_file} -> {new_file}')
            try:
                os.rename(old_file, new_file)
                print(f'Renamed: {old_file} -> {new_file}')
            except Exception as e:
                print(f'Error renaming {old_file}: {e}')

if __name__ == '__main__':
    client_directory = 'client'
    rename_files(client_directory)
