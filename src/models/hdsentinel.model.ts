export interface HDSentinelRoot {
    "?xml"?: XmlMeta;
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
    Process_ID: number | string;
    Uptime: string;
}

// --- PHYSICAL DISK INFORMATION ---

export interface PhysicalDiskInformation {
    Hard_Disk_Summary: HardDiskSummary;
    Properties?: DiskProperties;
    NVMe_Features?: NVMeFeatures;
    NVMe_Namespace_Information?: NVMeNamespaceInformation;
    Disk_Information?: DiskInformationDetails;
    SCSI_Information?: SCSIInformation;
    "S.M.A.R.T."?: SmartData;
}

export interface HardDiskSummary {
    Hard_Disk_Number: number | string;
    Hard_Disk_Device: string;
    Interface: string;
    Hard_Disk_Model_ID: string;
    Firmware_Revision: string;
    Hard_Disk_Serial_Number: string;
    Total_Size: string;
    Current_Temperature: string;
    Maximum_temperature_during_entire_lifespan: string;
    Power_on_time?: string;
    Estimated_remaining_lifetime?: string;
    Lifetime_writes?: string;
    Health: string;
    Performance: string;
    Description?: string;
    Tip?: string;
}

export interface DiskProperties {
    NVMe_Standard_Version?: string | number;
    PCI_Vendor_ID_VID?: string;
    PCI_Subsystem_Vendor_ID_SSVID?: string;
    IEEE_OUI_Identifier?: string;
    Recommended_Arbitration_Burst_RAB?: number | string;
    Multi_Interface_Capabilities?: number | string;
    Maximum_Data_Transfer_Size?: string;
    Abort_Command_Limit?: number | string;
    Asynchronous_Event_Request_Limit?: number | string;
    Number_FW_Slots_Support?: number | string;
    Maximum_Error_Log_Page_Entries?: number | string;
    Total_Number_Of_Power_States?: number | string;
    Admin_Vendor_Specific_CMD_Format?: number | string;
    Submission_Queue_Entry_Size?: string;
    Completion_Queue_Entry_Size?: string;
    Number_of_Namespaces?: number | string;
    Stripe_Size?: number | string;
    Maximum_Power_mW?: number | string;
    // USB / SCSI specifikus tulajdonságok
    Vendor_Information?: string;
    Status?: string;
    Version?: number | string;
    Device_Type?: string;
    ASC?: number | string;
    ASCQ?: number | string;
    Bytes_Per_Sector?: number | string;
    Total_Sectors?: string | number;
    Unformatted_Capacity?: string | number;
}

export interface SCSIInformation {
    Removable?: string;
    // Az XML-ben duplázva szerepel a Failure_Prediction tag, így tömbként vagy stringként is érkezhet
    Failure_Prediction?: string | string[];
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
    Estimated_Time_For_Block_Erase?: number | string;
}

export interface NVMeNamespaceInformation {
    NS_1_Total_Sectors?: number | string;
    NS_1_Sector_Size?: string;
    NS_1_Active_LBA_Format_Index?: number | string;
    NS_1_LBA_Formats_Supported?: number | string;
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
<?xml version="1.0" encoding="ISO-8859-2"?>
<Hard_Disk_Sentinel>
  <General_Information>
    <Application_Information>
      <Installed_version>Hard Disk Sentinel 0.20c-x64</Installed_version>
      <Current_Date_And_Time>31-7-26 11:02:43</Current_Date_And_Time>
      <Report_Creation_Time>0.151 s</Report_Creation_Time>
    </Application_Information>
    <Computer_Information>
      <Computer_Name>fedora</Computer_Name>
      <MAC_Address>16:61:b8:2a:9d:c7</MAC_Address>
    </Computer_Information>
    <System_Information>
      <OS_Version>Linux : 7.1.3-201.fc44.x86_64 (#1 SMP PREEMPT_DYNAMIC Tue Jul 14 06:30:42 UTC 2026)</OS_Version>
      <Process_ID>28898</Process_ID>
      <Uptime>13055 sec (0 days, 3 hours, 37 min, 35 sec)</Uptime>
    </System_Information>
  </General_Information>
  <Physical_Disk_Information_Disk_0>
    <Hard_Disk_Summary>
      <Hard_Disk_Number>0</Hard_Disk_Number>
      <Hard_Disk_Device>/dev/nvme0</Hard_Disk_Device>
      <Interface>NVMe</Interface>
      <Hard_Disk_Model_ID>HFM512GD3JX013N</Hard_Disk_Model_ID>
      <Firmware_Revision>41000C20</Firmware_Revision>
      <Hard_Disk_Serial_Number>CYB3N054410803R0G</Hard_Disk_Serial_Number>
      <Total_Size>488386 MB</Total_Size>
      <Current_Temperature>37 �C (99 �F)</Current_Temperature>
      <Maximum_temperature_during_entire_lifespan>37 �C (99 �F)</Maximum_temperature_during_entire_lifespan>
      <Power_on_time>74 days, 5 hours</Power_on_time>
      <Estimated_remaining_lifetime>more than 1000 days</Estimated_remaining_lifetime>
      <Lifetime_writes>17.29 TB</Lifetime_writes>
      <Health>99 %</Health>
      <Performance>100 %</Performance>
      <Description>The status of the solid state disk is PERFECT. Problematic or weak sectors were not found.  The health is determined by SSD specific S.M.A.R.T. attribute(s):  Available Spare (Percent), Percentage Used</Description>
      <Tip>No actions needed.</Tip>
    </Hard_Disk_Summary>
    <Properties>
      <NVMe_Standard_Version>1.3</NVMe_Standard_Version>
      <PCI_Vendor_ID_VID>0x1C5C</PCI_Vendor_ID_VID>
      <PCI_Subsystem_Vendor_ID_SSVID>0x1C5C</PCI_Subsystem_Vendor_ID_SSVID>
      <IEEE_OUI_Identifier>2E-E4-AC</IEEE_OUI_Identifier>
      <Recommended_Arbitration_Burst_RAB>3</Recommended_Arbitration_Burst_RAB>
      <Multi_Interface_Capabilities>0</Multi_Interface_Capabilities>
      <Maximum_Data_Transfer_Size>64 (6)</Maximum_Data_Transfer_Size>
      <Abort_Command_Limit>4</Abort_Command_Limit>
      <Asynchronous_Event_Request_Limit>8</Asynchronous_Event_Request_Limit>
      <Number_FW_Slots_Support>3</Number_FW_Slots_Support>
      <Maximum_Error_Log_Page_Entries>256</Maximum_Error_Log_Page_Entries>
      <Total_Number_Of_Power_States>5</Total_Number_Of_Power_States>
      <Admin_Vendor_Specific_CMD_Format>1</Admin_Vendor_Specific_CMD_Format>
      <Submission_Queue_Entry_Size>Max: 64, Min: 64</Submission_Queue_Entry_Size>
      <Completion_Queue_Entry_Size>Max: 16, Min: 16</Completion_Queue_Entry_Size>
      <Number_of_Namespaces>1</Number_of_Namespaces>
      <Stripe_Size>0</Stripe_Size>
      <Maximum_Power_mW>6300</Maximum_Power_mW>
    </Properties>
    <NVMe_Features>
      <Doorbell_Buffer_Config>Not supported [0]</Doorbell_Buffer_Config>
      <Virtualization_Management>Not supported [0]</Virtualization_Management>
      <NVMe_MI_Send_Receive>Not supported [0]</NVMe_MI_Send_Receive>
      <Directives>Not supported [0]</Directives>
      <Device_Self_test>Supported [1]</Device_Self_test>
      <Extended_Self_test_Estimated_Time>30 minutes</Extended_Self_test_Estimated_Time>
      <Only_One_Device_Self_test>Yes</Only_One_Device_Self_test>
      <Namespace_Management>Not supported [0]</Namespace_Management>
      <Firmware_Activate_Download>Supported [1]</Firmware_Activate_Download>
      <Format_NVM>Supported [1]</Format_NVM>
      <Security_Send_Receive>Supported [1]</Security_Send_Receive>
      <Firmware_Activation_Without_Reset>Supported [1]</Firmware_Activation_Without_Reset>
      <First_Firmware_Slot_Read_Only>No</First_Firmware_Slot_Read_Only>
      <Command_Effects_Log_Page>Supported [1]</Command_Effects_Log_Page>
      <SMART_Information_Per_Namespace>Not supported [0]</SMART_Information_Per_Namespace>
      <Reservations>Not supported [0]</Reservations>
      <Save_Select_Fields>Supported [1]</Save_Select_Fields>
      <Write_Zeroes>Supported [1]</Write_Zeroes>
      <Dataset_Management_Command>Supported [1]</Dataset_Management_Command>
      <Write_Uncorrectable_Command>Supported [1]</Write_Uncorrectable_Command>
      <Compare_Command>Supported [1]</Compare_Command>
      <Compare_and_Write_Fused_Operation>Not supported [0]</Compare_and_Write_Fused_Operation>
      <Cryptographic_Erase>Not supported [0]</Cryptographic_Erase>
      <Secure_Erase_All_Namespaces>Not supported [0]</Secure_Erase_All_Namespaces>
      <Format_All_Namespaces>Not supported [0]</Format_All_Namespaces>
      <Volatile_Write_Cache_Present>Supported [1]</Volatile_Write_Cache_Present>
      <Autonomous_Power_State_Transitions>Supported [1]</Autonomous_Power_State_Transitions>
      <Atomic_Compare_And_Write_Unit>Not supported [0]</Atomic_Compare_And_Write_Unit>
      <Scatter_Gather_List_SGL>Not supported [0]</Scatter_Gather_List_SGL>
      <Host_Controlled_Thermal_Management>Supported [1]</Host_Controlled_Thermal_Management>
      <Thermal_Management_Temperature_1>Unknown</Thermal_Management_Temperature_1>
      <Thermal_Management_Temperature_2>Unknown</Thermal_Management_Temperature_2>
      <Warning_Composite_Temperature_Threshold>356 �K (83 �C)</Warning_Composite_Temperature_Threshold>
      <Critical_Composite_Temperature_Threshold>358 �K (85 �C)</Critical_Composite_Temperature_Threshold>
      <Sanitize_Overwrite>Not supported [0]</Sanitize_Overwrite>
      <Sanitize_Block_Erase>Supported [1]</Sanitize_Block_Erase>
      <Sanitize_Crypto_Erase>Not supported [0]</Sanitize_Crypto_Erase>
      <Sanitize_Status>Never sanitized [0]</Sanitize_Status>
      <Estimated_Time_For_Block_Erase>10</Estimated_Time_For_Block_Erase>
    </NVMe_Features>
    <NVMe_Namespace_Information>
      <NS_1_Total_Sectors>1000215216</NS_1_Total_Sectors>
      <NS_1_Sector_Size>512 bytes</NS_1_Sector_Size>
      <NS_1_Active_LBA_Format_Index>0</NS_1_Active_LBA_Format_Index>
      <NS_1_LBA_Formats_Supported>2</NS_1_LBA_Formats_Supported>
      <NS_1_LBA_Format_List_Performance>512 bytes (Best), 4096 bytes (Best)</NS_1_LBA_Format_List_Performance>
    </NVMe_Namespace_Information>
    <Disk_Information>
      <Disk_Information></Disk_Information>
      <Form_Factor>M.2 2280</Form_Factor>
      <Capacity>512 GB (512 x 1,000,000,000 bytes)</Capacity>
      <Disk_Interface>PCI-Express x4 (3.0)</Disk_Interface>
      <Device_Type>NAND</Device_Type>
      <Width>22.0 mm (0.9 inch)</Width>
      <Depth>80.0 mm (3.1 inch)</Depth>
      <Height>2.2 mm (0.1 inch)</Height>
      <Weight>8 grams (0.0 pounds)</Weight>
    </Disk_Information>
    <S.M.A.R.T.>
<Attribute Name="Critical Warning" Threshold="" Value="0" />
<Attribute Name="Composite Temperature (Kelvin)" Threshold="" Value="310" />
<Attribute Name="Available Spare (Percent)" Threshold="" Value="100" />
<Attribute Name="Available Spare Threshold" Threshold="" Value="10" />
<Attribute Name="Percentage Used" Threshold="" Value="1" />
<Attribute Name="Data Units Read (512000 Bytes)" Threshold="" Value="33,013,187" />
<Attribute Name="Data Units Written (512000 Bytes)" Threshold="" Value="37,136,289" />
<Attribute Name="Host Read Commands" Threshold="" Value="302,584,987" />
<Attribute Name="Host Write Commands" Threshold="" Value="306,968,070" />
<Attribute Name="Controller Busy Time (minutes)" Threshold="" Value="703" />
<Attribute Name="Power Cycles" Threshold="" Value="11,485" />
<Attribute Name="Power On Hours" Threshold="" Value="1,781" />
<Attribute Name="Unsafe Shutdowns" Threshold="" Value="164" />
<Attribute Name="Media and Data Integrity Errors" Threshold="" Value="0" />
<Attribute Name="Number of Error Information Log Entries" Threshold="" Value="0" />
<Attribute Name="Warning Composite Temperature Time (minutes)" Threshold="" Value="0" />
<Attribute Name="Critical Composite Temperature Time (minutes)" Threshold="" Value="0" />
<Attribute Name="Temperature Sensor 1" Threshold="" Value="310" />
<Attribute Name="Temperature Sensor 2" Threshold="" Value="316" />
    </S.M.A.R.T.>
  </Physical_Disk_Information_Disk_0>
  <Physical_Disk_Information_Disk_1>
    <Hard_Disk_Summary>
      <Hard_Disk_Number>1</Hard_Disk_Number>
      <Hard_Disk_Device>/dev/sda</Hard_Disk_Device>
      <Interface>SCSI</Interface>
      <Hard_Disk_Model_ID>USB DISK 2.0</Hard_Disk_Model_ID>
      <Firmware_Revision>PMAP</Firmware_Revision>
      <Hard_Disk_Serial_Number>PMAP1234PhIsOn</Hard_Disk_Serial_Number>
      <Total_Size>14805 MB</Total_Size>
      <Current_Temperature>?</Current_Temperature>
      <Maximum_temperature_during_entire_lifespan>?</Maximum_temperature_during_entire_lifespan>
      <Health>? %</Health>
      <Performance>? %</Performance>
    </Hard_Disk_Summary>
    <Properties>
      <Vendor_Information>?</Vendor_Information>
      <Status>OK</Status>
      <Version>6</Version>
      <Device_Type>Disk</Device_Type>
      <ASC>0</ASC>
      <ASCQ>0</ASCQ>
      <Bytes_Per_Sector>512</Bytes_Per_Sector>
      <Total_Sectors>30,322,687</Total_Sectors>
      <Unformatted_Capacity>15,525,215,744</Unformatted_Capacity>
    </Properties>
    <SCSI_Information>
      <Removable>Supported [1]</Removable>
      <Failure_Prediction>Not supported [0]</Failure_Prediction>
      <Failure_Prediction>Disabled</Failure_Prediction>
    </SCSI_Information>
  </Physical_Disk_Information_Disk_1>
  <Physical_Disk_Information_Disk_2>
    <Hard_Disk_Summary>
      <Hard_Disk_Number>2</Hard_Disk_Number>
      <Hard_Disk_Device>/dev/sdb</Hard_Disk_Device>
      <Interface>SCSI</Interface>
      <Hard_Disk_Model_ID>USB DISK Pro</Hard_Disk_Model_ID>
      <Firmware_Revision>PMAP</Firmware_Revision>
      <Hard_Disk_Serial_Number>PMAP1234</Hard_Disk_Serial_Number>
      <Total_Size>29565 MB</Total_Size>
      <Current_Temperature>?</Current_Temperature>
      <Maximum_temperature_during_entire_lifespan>?</Maximum_temperature_during_entire_lifespan>
      <Health>? %</Health>
      <Performance>? %</Performance>
    </Hard_Disk_Summary>
    <Properties>
      <Vendor_Information>?</Vendor_Information>
      <Status>OK</Status>
      <Version>4</Version>
      <Device_Type>Disk</Device_Type>
      <ASC>0</ASC>
      <ASCQ>0</ASCQ>
      <Bytes_Per_Sector>512</Bytes_Per_Sector>
      <Total_Sectors>60,549,503</Total_Sectors>
      <Unformatted_Capacity>31,001,345,536</Unformatted_Capacity>
    </Properties>
    <SCSI_Information>
      <Removable>Supported [1]</Removable>
      <Failure_Prediction>Not supported [0]</Failure_Prediction>
      <Failure_Prediction>Disabled</Failure_Prediction>
    </SCSI_Information>
  </Physical_Disk_Information_Disk_2>
  <Partition_Information>
    <Partition Drive="/" Total_Space="485,737 MB" Free_Space="310,243 MB" Free_Space_Percent=" 64 %" Disk="/" BlockSize="4096" Files="0" FileSystem="2435016766" />
    <Partition Drive="/run/media/fablevi/UEFI_NTFS (Disk #1)" Total_Space="     1 MB" Free_Space="     0 MB" Free_Space_Percent=" 13 %" Disk="/dev/sda2" BlockSize="2048" Files="0" FileSystem="19780" />
    <Partition Drive="/run/media/fablevi/CCCOMA_X64FRE_HU-HU_DV9 (Disk #1)" Total_Space="14,804 MB" Free_Space=" 8,418 MB" Free_Space_Percent=" 57 %" Disk="/dev/sda1" BlockSize="4096" Files="8685436" FileSystem="1702057286" />
    <Partition Drive="/run/media/fablevi/Ventoy (Disk #2)" Total_Space="29,529 MB" Free_Space="11,782 MB" Free_Space_Percent=" 40 %" Disk="/dev/sdb1" BlockSize="32768" Files="0" FileSystem="538032816" />
  </Partition_Information>
</Hard_Disk_Sentinel>auto

 */