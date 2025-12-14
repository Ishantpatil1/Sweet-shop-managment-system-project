#!/usr/bin/env python3
"""
TypeScript to JavaScript Migration Script
Converts all .ts and .tsx files to .js and .jsx
Removes type annotations, interfaces, and TypeScript-specific syntax
"""

import os
import re
from pathlib import Path

def remove_type_annotations(content):
    """Remove TypeScript type annotations from code"""
    
    # Remove interface definitions
    content = re.sub(
        r'^interface\s+\w+(?:\s*<[^>]*>)?\s*\{[^}]*\}',
        '',
        content,
        flags=re.MULTILINE | re.DOTALL
    )
    
    # Remove type aliases: type X = ...
    content = re.sub(
        r'^type\s+\w+(?:\s*<[^>]*>)?\s*=\s*[^;]+;',
        '',
        content,
        flags=re.MULTILINE
    )
    
    # Remove : Type annotations from variables and parameters
    # Match patterns like : Type or : Type<Generic> or : 'literal'
    content = re.sub(
        r':\s*(?:[A-Z]\w*(?:<[^>]*>)?|\{[^}]*\}|[\'"][^\'"]*[\'"])',
        '',
        content
    )
    
    # Remove <Generic> from function/component declarations
    content = re.sub(
        r'<[^>]*>(?=\s*\()',
        '',
        content
    )
    
    # Remove React.FC<Props> -> keep just the function
    content = re.sub(
        r'React\.FC<[^>]*>\s*=',
        '=',
        content
    )
    
    # Remove as Type casts
    content = re.sub(
        r'\s+as\s+(?:[A-Z]\w*(?:<[^>]*>)?|\{[^}]*\})',
        '',
        content
    )
    
    # Remove implements Type
    content = re.sub(
        r'\s+implements\s+[A-Z]\w*(?:\s*,\s*[A-Z]\w*)*',
        '',
        content
    )
    
    # Remove extends Type
    content = re.sub(
        r'\s+extends\s+[A-Z]\w*(?:<[^>]*>)?',
        '',
        content
    )
    
    # Remove ! non-null assertion operator (but keep the identifier)
    content = re.sub(
        r'([a-zA-Z_$}\])\!(?=\s|[,;:\)])',
        r'\1',
        content
    )
    
    # Remove enum keyword and convert to const object
    content = re.sub(
        r'enum\s+(\w+)\s*\{',
        r'const \1 = {',
        content
    )
    
    # Clean up excess blank lines
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    return content

def remove_type_imports(content):
    """Remove TypeScript-only imports"""
    
    # Remove type-only imports: import type { ... } from '...'
    content = re.sub(
        r'import\s+type\s+\{[^}]*\}\s+from\s+[\'"][^\'"]*[\'"];?\n?',
        '',
        content
    )
    
    # Remove type imports from regular imports: import { type X, Y } -> import { Y }
    content = re.sub(
        r'\btype\s+\w+(?:\s*,\s*)?',
        '',
        content
    )
    
    # Clean up empty imports
    content = re.sub(
        r'import\s+\{\s*\}\s+from',
        'import {} from',
        content
    )
    
    return content

def convert_ts_to_js(content):
    """Convert TypeScript code to JavaScript"""
    
    # Remove type annotations
    content = remove_type_annotations(content)
    
    # Remove type imports
    content = remove_type_imports(content)
    
    # Clean up extra whitespace and blank lines
    lines = content.split('\n')
    cleaned_lines = []
    prev_blank = False
    
    for line in lines:
        if line.strip() == '':
            if not prev_blank:
                cleaned_lines.append(line)
            prev_blank = True
        else:
            cleaned_lines.append(line)
            prev_blank = False
    
    content = '\n'.join(cleaned_lines)
    
    return content

def process_files(root_dir, extensions=['.ts', '.tsx']):
    """Process all TypeScript files in a directory"""
    
    root_path = Path(root_dir)
    skip_dirs = {'node_modules', '.git', 'dist', 'build'}
    
    conversions = []
    
    for ts_file in root_path.rglob('*'):
        # Skip node_modules and other build directories
        if any(skip in ts_file.parts for skip in skip_dirs):
            continue
        
        if ts_file.suffix in extensions:
            js_ext = '.js' if ts_file.suffix == '.ts' else '.jsx'
            js_file = ts_file.with_suffix(js_ext)
            
            conversions.append({
                'ts_file': ts_file,
                'js_file': js_file,
                'is_new': not js_file.exists()
            })
    
    return conversions

if __name__ == '__main__':
    # This would be run manually with file reading
    print("TypeScript to JavaScript Conversion Script loaded")
    print("Ready to convert files")

