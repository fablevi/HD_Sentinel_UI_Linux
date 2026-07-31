export interface HDSentinelRoot {
    "?xml": XmlMeta;
    Hard_Disk_Sentinel: HardDiskSentinel;
}

export interface XmlMeta {
    version: string;
    encoding: string;
}

export interface HardDiskSentinel {
    General_Information: GeneralInformation;
    Physical_Disk_Information: PhysicalDiskInformation[];
    Partition_Information: PartitionInformation;
}

// --- GENERAL INFORMATION ---

export interface GeneralInformation {
    Application_Information: ApplicationInformation;
    Computer_Information: ComputerInformation;
    System_Information: SystemInformation;
}

export interface ApplicationInformation {
    Installed_version: string;
    Current_Date_And_Time: string;
    Report_Creation_Time: string;
}

export interface ComputerInformation {
    Computer_Name: string;
    MAC_Address: string;
}

export interface SystemInformation {
    OS_Version: string;
    Process_ID: number;
    Uptime: string;
}

// --- PHYSICAL DISK INFORMATION ---

export interface PhysicalDiskInformation {
    Hard_Disk_Summary: HardDiskSummary;
    // Az NVMe és S.M.A.R.T. adatok opcionálisak lehetnek,
    // ha pl. egy pendrive-ot vagy régi HDD-t olvasol be.
    Properties?: DiskProperties;
    NVMe_Features?: NVMeFeatures;
    NVMe_Namespace_Information?: NVMeNamespaceInformation;
    Disk_Information?: DiskInformationDetails;
    "S.M.A.R.T."?: SmartData;
}

export interface HardDiskSummary {
    Hard_Disk_Number: number;
    Hard_Disk_Device: string;
    Interface: string;
    Hard_Disk_Model_ID: string;
    Firmware_Revision: string;
    Hard_Disk_Serial_Number: string;
    Total_Size: string;
    Current_Temperature: string;
    Maximum_temperature_during_entire_lifespan: string;
    Power_on_time: string;
    Estimated_remaining_lifetime: string;
    Lifetime_writes: string;
    Health: string;
    Performance: string;
    Description: string;
    Tip: string;
}

export interface DiskProperties {
    NVMe_Standard_Version?: number;
    PCI_Vendor_ID_VID?: number;
    PCI_Subsystem_Vendor_ID_SSVID?: number;
    IEEE_OUI_Identifier?: string;
    Recommended_Arbitration_Burst_RAB?: number;
    Multi_Interface_Capabilities?: number;
    Maximum_Data_Transfer_Size?: string;
    Abort_Command_Limit?: number;
    Asynchronous_Event_Request_Limit?: number;
    Number_FW_Slots_Support?: number;
    Maximum_Error_Log_Page_Entries?: number;
    Total_Number_Of_Power_States?: number;
    Admin_Vendor_Specific_CMD_Format?: number;
    Submission_Queue_Entry_Size?: string;
    Completion_Queue_Entry_Size?: string;
    Number_of_Namespaces?: number;
    Stripe_Size?: number;
    Maximum_Power_mW?: number;
}

export interface NVMeFeatures {
    Doorbell_Buffer_Config?: string;
    Virtualization_Management?: string;
    NVMe_MI_Send_Receive?: string;
    Directives?: string;
    Device_Self_test?: string;
    Extended_Self_test_Estimated_Time?: string;
    Only_One_Device_Self_test?: string;
    Namespace_Management?: string;
    Firmware_Activate_Download?: string;
    Format_NVM?: string;
    Security_Send_Receive?: string;
    Firmware_Activation_Without_Reset?: string;
    First_Firmware_Slot_Read_Only?: string;
    Command_Effects_Log_Page?: string;
    SMART_Information_Per_Namespace?: string;
    Reservations?: string;
    Save_Select_Fields?: string;
    Write_Zeroes?: string;
    Dataset_Management_Command?: string;
    Write_Uncorrectable_Command?: string;
    Compare_Command?: string;
    Compare_and_Write_Fused_Operation?: string;
    Cryptographic_Erase?: string;
    Secure_Erase_All_Namespaces?: string;
    Format_All_Namespaces?: string;
    Volatile_Write_Cache_Present?: string;
    Autonomous_Power_State_Transitions?: string;
    Atomic_Compare_And_Write_Unit?: string;
    Scatter_Gather_List_SGL?: string;
    Host_Controlled_Thermal_Management?: string;
    Thermal_Management_Temperature_1?: string;
    Thermal_Management_Temperature_2?: string;
    Warning_Composite_Temperature_Threshold?: string;
    Critical_Composite_Temperature_Threshold?: string;
    Sanitize_Overwrite?: string;
    Sanitize_Block_Erase?: string;
    Sanitize_Crypto_Erase?: string;
    Sanitize_Status?: string;
    Estimated_Time_For_Block_Erase?: number;
}

export interface NVMeNamespaceInformation {
    NS_1_Total_Sectors?: number;
    NS_1_Sector_Size?: string;
    NS_1_Active_LBA_Format_Index?: number;
    NS_1_LBA_Formats_Supported?: number;
    NS_1_LBA_Format_List_Performance?: string;
}

export interface DiskInformationDetails {
    Disk_Information?: string;
    Form_Factor?: string;
    Capacity?: string;
    Disk_Interface?: string;
    Device_Type?: string;
    Width?: string;
    Depth?: string;
    Height?: string;
    Weight?: string;
}

// --- S.M.A.R.T. INFORMATION ---

export interface SmartData {
    Attribute: SmartAttribute[];
}

export interface SmartAttribute {
    Name: string;
    Threshold: string | number;
    Value: string | number;
}

// --- PARTITION INFORMATION ---

export interface PartitionInformation {
    Partition: PartitionDetails[];
}

export interface PartitionDetails {
    Drive: string;
    Total_Space: string;
    Free_Space: string;
    Free_Space_Percent: string;
    Disk: string;
    BlockSize: string | number;
    Files: string | number;
    FileSystem: string;
}

/*
{
  "?xml": {
    "version": "1.0",
    "encoding": "ISO-8859-2"
  },
  "Hard_Disk_Sentinel": {
    "General_Information": {
      "Application_Information": {
        "Installed_version": "Hard Disk Sentinel 0.20c-x64",
        "Current_Date_And_Time": "26-7-26 20:22:54",
        "Report_Creation_Time": "0.143 s"
      },
      "Computer_Information": {
        "Computer_Name": "fedora",
        "MAC_Address": "36:04:29:cf:f5:73"
      },
      "System_Information": {
        "OS_Version": "Linux : 7.1.3-201.fc44.x86_64 (#1 SMP PREEMPT_DYNAMIC Tue Jul 14 06:30:42 UTC 2026)",
        "Process_ID": 88213,
        "Uptime": "13611 sec (0 days, 3 hours, 46 min, 51 sec)"
      }
    },
    "Physical_Disk_Information": [
      {
        "Hard_Disk_Summary": {
          "Hard_Disk_Number": 0,
          "Hard_Disk_Device": "/dev/nvme0",
          "Interface": "NVMe",
          "Hard_Disk_Model_ID": "HFM512GD3JX013N",
          "Firmware_Revision": "41000C20",
          "Hard_Disk_Serial_Number": "CYB3N054410803R0G",
          "Total_Size": "488386 MB",
          "Current_Temperature": "43 �C (109 �F)",
          "Maximum_temperature_during_entire_lifespan": "43 �C (109 �F)",
          "Power_on_time": "73 days, 11 hours",
          "Estimated_remaining_lifetime": "more than 1000 days",
          "Lifetime_writes": "17.28 TB",
          "Health": "99 %",
          "Performance": "100 %",
          "Description": "The status of the solid state disk is PERFECT. Problematic or weak sectors were not found.  The health is determined by SSD specific S.M.A.R.T. attribute(s):  Available Spare (Percent), Percentage Used",
          "Tip": "No actions needed."
        },
        "Properties": {
          "NVMe_Standard_Version": 1.3,
          "PCI_Vendor_ID_VID": 7260,
          "PCI_Subsystem_Vendor_ID_SSVID": 7260,
          "IEEE_OUI_Identifier": "2E-E4-AC",
          "Recommended_Arbitration_Burst_RAB": 3,
          "Multi_Interface_Capabilities": 0,
          "Maximum_Data_Transfer_Size": "64 (6)",
          "Abort_Command_Limit": 4,
          "Asynchronous_Event_Request_Limit": 8,
          "Number_FW_Slots_Support": 3,
          "Maximum_Error_Log_Page_Entries": 256,
          "Total_Number_Of_Power_States": 5,
          "Admin_Vendor_Specific_CMD_Format": 1,
          "Submission_Queue_Entry_Size": "Max: 64, Min: 64",
          "Completion_Queue_Entry_Size": "Max: 16, Min: 16",
          "Number_of_Namespaces": 1,
          "Stripe_Size": 0,
          "Maximum_Power_mW": 6300
        },
        "NVMe_Features": {
          "Doorbell_Buffer_Config": "Not supported [0]",
          "Virtualization_Management": "Not supported [0]",
          "NVMe_MI_Send_Receive": "Not supported [0]",
          "Directives": "Not supported [0]",
          "Device_Self_test": "Supported [1]",
          "Extended_Self_test_Estimated_Time": "30 minutes",
          "Only_One_Device_Self_test": "Yes",
          "Namespace_Management": "Not supported [0]",
          "Firmware_Activate_Download": "Supported [1]",
          "Format_NVM": "Supported [1]",
          "Security_Send_Receive": "Supported [1]",
          "Firmware_Activation_Without_Reset": "Supported [1]",
          "First_Firmware_Slot_Read_Only": "No",
          "Command_Effects_Log_Page": "Supported [1]",
          "SMART_Information_Per_Namespace": "Not supported [0]",
          "Reservations": "Not supported [0]",
          "Save_Select_Fields": "Supported [1]",
          "Write_Zeroes": "Supported [1]",
          "Dataset_Management_Command": "Supported [1]",
          "Write_Uncorrectable_Command": "Supported [1]",
          "Compare_Command": "Supported [1]",
          "Compare_and_Write_Fused_Operation": "Not supported [0]",
          "Cryptographic_Erase": "Not supported [0]",
          "Secure_Erase_All_Namespaces": "Not supported [0]",
          "Format_All_Namespaces": "Not supported [0]",
          "Volatile_Write_Cache_Present": "Supported [1]",
          "Autonomous_Power_State_Transitions": "Supported [1]",
          "Atomic_Compare_And_Write_Unit": "Not supported [0]",
          "Scatter_Gather_List_SGL": "Not supported [0]",
          "Host_Controlled_Thermal_Management": "Supported [1]",
          "Thermal_Management_Temperature_1": "Unknown",
          "Thermal_Management_Temperature_2": "Unknown",
          "Warning_Composite_Temperature_Threshold": "356 �K (83 �C)",
          "Critical_Composite_Temperature_Threshold": "358 �K (85 �C)",
          "Sanitize_Overwrite": "Not supported [0]",
          "Sanitize_Block_Erase": "Supported [1]",
          "Sanitize_Crypto_Erase": "Not supported [0]",
          "Sanitize_Status": "Never sanitized [0]",
          "Estimated_Time_For_Block_Erase": 10
        },
        "NVMe_Namespace_Information": {
          "NS_1_Total_Sectors": 1000215216,
          "NS_1_Sector_Size": "512 bytes",
          "NS_1_Active_LBA_Format_Index": 0,
          "NS_1_LBA_Formats_Supported": 2,
          "NS_1_LBA_Format_List_Performance": "512 bytes (Best), 4096 bytes (Best)"
        },
        "Disk_Information": {
          "Disk_Information": "",
          "Form_Factor": "M.2 2280",
          "Capacity": "512 GB (512 x 1,000,000,000 bytes)",
          "Disk_Interface": "PCI-Express x4 (3.0)",
          "Device_Type": "NAND",
          "Width": "22.0 mm (0.9 inch)",
          "Depth": "80.0 mm (3.1 inch)",
          "Height": "2.2 mm (0.1 inch)",
          "Weight": "8 grams (0.0 pounds)"
        },
        "S.M.A.R.T.": {
          "Attribute": [
            {
              "Name": "Critical Warning",
              "Threshold": "",
              "Value": "0"
            },
            {
              "Name": "Composite Temperature (Kelvin)",
              "Threshold": "",
              "Value": "316"
            },
            {
              "Name": "Available Spare (Percent)",
              "Threshold": "",
              "Value": "100"
            },
            {
              "Name": "Available Spare Threshold",
              "Threshold": "",
              "Value": "10"
            },
            {
              "Name": "Percentage Used",
              "Threshold": "",
              "Value": "1"
            },
            {
              "Name": "Data Units Read (512000 Bytes)",
              "Threshold": "",
              "Value": "32,970,329"
            },
            {
              "Name": "Data Units Written (512000 Bytes)",
              "Threshold": "",
              "Value": "37,099,208"
            },
            {
              "Name": "Host Read Commands",
              "Threshold": "",
              "Value": "301,997,715"
            },
            {
              "Name": "Host Write Commands",
              "Threshold": "",
              "Value": "305,942,686"
            },
            {
              "Name": "Controller Busy Time (minutes)",
              "Threshold": "",
              "Value": "700"
            },
            {
              "Name": "Power Cycles",
              "Threshold": "",
              "Value": "11,480"
            },
            {
              "Name": "Power On Hours",
              "Threshold": "",
              "Value": "1,763"
            },
            {
              "Name": "Unsafe Shutdowns",
              "Threshold": "",
              "Value": "164"
            },
            {
              "Name": "Media and Data Integrity Errors",
              "Threshold": "",
              "Value": "0"
            },
            {
              "Name": "Number of Error Information Log Entries",
              "Threshold": "",
              "Value": "0"
            },
            {
              "Name": "Warning Composite Temperature Time (minutes)",
              "Threshold": "",
              "Value": "0"
            },
            {
              "Name": "Critical Composite Temperature Time (minutes)",
              "Threshold": "",
              "Value": "0"
            },
            {
              "Name": "Temperature Sensor 1",
              "Threshold": "",
              "Value": "316"
            },
            {
              "Name": "Temperature Sensor 2",
              "Threshold": "",
              "Value": "323"
            }
          ]
        }
      }
    ],
    "Partition_Information": {
      "Partition": [
        {
          "Drive": "/",
          "Total_Space": "485,737 MB",
          "Free_Space": "310,344 MB",
          "Free_Space_Percent": "64 %",
          "Disk": "/",
          "BlockSize": "4096",
          "Files": "0",
          "FileSystem": "2435016766"
        }
      ]
    }
  }
}

 */