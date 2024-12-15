import os
import shutil

def rename_files(directory, dry_run=False, create_backup=False):
    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist.")
        return
    
    renamed_count = 0
    errors_count = 0
    
    for root, _, files in os.walk(directory):
        for filename in files:
            if filename.endswith('.jsx'):
                old_file = os.path.join(root, filename)
                new_file = os.path.join(root, filename.replace('.jsx', '.tsx'))
                
                print(f'Attempting to rename: {old_file} -> {new_file}')
                
                try:
                    if create_backup:
                        shutil.copy2(old_file, old_file + '.bak')
                    
                    if not dry_run:
                        os.rename(old_file, new_file)
                        renamed_count += 1
                        print(f'Renamed: {old_file} -> {new_file}')
                    else:
                        print(f'[DRY RUN] Would rename: {old_file} -> {new_file}')
                
                except Exception as e:
                    errors_count += 1
                    print(f'Error renaming {old_file}: {e}')
    
    print(f'\nSummary:\nRenamed files: {renamed_count}\nErrors: {errors_count}')

if __name__ == '__main__':
    client_directory = 'client'
    
    # Uncomment and modify as needed
    # rename_files(client_directory, dry_run=True)  # Preview changes
    # rename_files(client_directory, create_backup=True)  # Create backups
    rename_files(client_directory)