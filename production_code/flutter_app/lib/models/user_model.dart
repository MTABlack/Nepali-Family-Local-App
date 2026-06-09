class UserModel {
  final String id;
  final String phone;
  final String fullName;
  final String username;
  final String province;
  final String district;
  final String municipality;
  final int wardNumber;
  final int verificationLevel; // Level 1 (Phone Verified) to Level 4 (Trusted Citizen)
  final int reputationPoints;

  UserModel({
    required this.id,
    required this.phone,
    required this.fullName,
    required this.username,
    required this.province,
    required this.district,
    required this.municipality,
    required this.wardNumber,
    required this.verificationLevel,
    required this.reputationPoints,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'phone': phone,
      'fullName': fullName,
      'username': username,
      'province': province,
      'district': district,
      'municipality': municipality,
      'wardNumber': wardNumber,
      'verificationLevel': verificationLevel,
      'reputationPoints': reputationPoints,
    };
  }

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'] ?? '',
      phone: map['phone'] ?? '',
      fullName: map['fullName'] ?? '',
      username: map['username'] ?? '',
      province: map['province'] ?? '',
      district: map['district'] ?? '',
      municipality: map['municipality'] ?? '',
      wardNumber: map['wardNumber'] ?? 1,
      verificationLevel: map['verificationLevel'] ?? 1,
      reputationPoints: map['reputationPoints'] ?? 10,
    );
  }
}
