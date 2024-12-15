import os

def rename_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.jsx'):
            old_file = os.path.join(directory, filename)
            new_file = os.path.join(directory, filename.replace('.jsx', '.tsx'))
            os.rename(old_file, new_file)
            print(f'Renamed: {old_file} -> {new_file}')


client_directory = 'client'
rename_files(client_directory)
